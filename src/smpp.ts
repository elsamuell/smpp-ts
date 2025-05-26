import { Defs } from './defs';
import * as net  from 'net';
import * as tls from 'tls';
import { proxy } from 'findhit-proxywrap';
import { Session } from './session';

const proxyTransport = proxy(net, {
	strict: false,
	ignoreStrictExceptions: true
});

const proxyTlsTransport = proxy(tls, {
	strict: false,
	ignoreStrictExceptions: true
});


class Server extends net.Server {

	public sessions: Array<Session> = [];
	public tls: any;
	private options: Partial<Options>;

	constructor(options?: Partial<Options>, listener?: ((listener: any) => void)){
		super();
		if (typeof options == 'function') {
			listener = options;
			options = {} as Options;
		} else {
			options = options || {} as Options;
		}
		if (listener) {
			this.on('session', listener);
		}

		this.tls = options.key && options.cert;
		options.tls = this.tls != null; // standarized option for the session on both client & server
		this.options = options;
		this.on("proxiedConnection", (socket) =>{
			// The connection has successfully passed through the proxied server (event emitted by proxywrap)
			socket.proxiedConnection = true;
		});
	}

	init(transport: any) {
		transport.Server.call(this, this.options,  (socket: net.Socket | tls.TLSSocket | proxy.Server.Socket) => {
			const session = new Session({
				socket: socket,
				tls: this.options.tls,
				debug: this.options.debug,
				debugListener: this.options.debugListener ?? null
			} as Options);
			session.server = this;
			if (socket.savedEmit) {
				// Restore the saved emit to fix the proxywrap bug (on nodejs <=8)
				socket.emit = socket.savedEmit;
				socket.savedEmit = null;
			}
			session.debug("client.connected", "client has connected", {
				secure: this.options?.tls,
				// Useful information for Proxy protocol debugging & testing
				proxiedServer: this.options?.isProxiedServer,
				proxiedConnection: socket.proxiedConnection ?? (socket._parent ? socket._parent.proxiedConnection : false) ?? false,
				remoteAddress: session.remoteAddress,
				remotePort: session.remotePort,
				proxyProtocolProxy: session.proxyProtocolProxy,
			});
			this.sessions.push(session);
			socket.on('close', () => {
				this.sessions.splice(this.sessions.indexOf(session), 1);
			});
			this.emit('session', session);
			session.emitMetric("client.connected", 1);
		});

		if (this.options?.isProxiedServer) {
			// The proxied wrapper clears all connection listeners and adds their own.
			// A new listener is added in order to catch socket error on the wrapper.
			this.on("connection", (socket) => {
				socket.on("error", (e) => {
					this.emit("error", e);
				});
				if (this.options.autoPrependBuffer)  {
					// Allows to automatically prepend a buffer on the client socket. This feature is intended only for
					// testing purposes and it's used to inject client simulated headers (Proxy protocol)
					socket.unshift(this.options.autoPrependBuffer);
				}
				// There's a bug in the proxywrap server which tampers the emit method in nodejs <= 8 and makes the
				// socket unable to emit the events. As a simple fix, save the emit method so it can be restored later.
				this.options.socket.savedEmit = socket.emit;
			});
		}
	}
}


// Servers with proxy protocol support
class SecureServer extends tls.Server {
	constructor(options: Partial<Options>, listener: ((listener: any) => void)){
		super();
		const server: Server = Server.call(this, options, listener);
		server.init(tls);
	}
}

class ProxyServer extends proxyTransport.Server {
	constructor(options: Partial<Options>, listener: ((listener: any) => void)){
		super();
		options.isProxiedServer = true;
		const server: Server = Server.call(this, options, listener);
		server.init(proxyTransport);
	}
}

class ProxySecureServer extends proxyTlsTransport.Server {
	constructor(options: Partial<Options>, listener: ((listener: any) => void)) {
		super();
		options.isProxiedServer = true;
		const server: Server = Server.call(this, options, listener);
		server.init(proxyTlsTransport);
	}
}

for (let key in Defs) {
	exports[key] = Defs[key];
}
for (let error in Defs.errors) {
	exports[error] = Defs.errors[error];
}
for (let key in Defs.consts) {
	exports[key] = Defs.consts[key];
}


function addTLV(tag: string, options: Partial<Options>) {
	options.tag = tag;
	Defs.tlvs[tag] = options;
	Defs.tlvsById[options.id] = options;
};

export class SMPP {

	public static readonly addTLV = addTLV;

	public static connect(options?: Partial<Options>){
		return new Session(options);
	}

	public static createServer(options?: Partial<Options> | ((listener: any) => void), listener?: ((listener: any) => void)) {
		if (typeof options == 'function') {
			listener = options;
			options = {} as Options;
		} else {
			options = options || {} as Options;
		}
		if (options?.key && options?.cert) {
			if (options.enable_proxy_protocol_detection) {
				return new ProxySecureServer(options, listener);
			} else {
				return new SecureServer(options, listener);
			}
		} else if (options.enable_proxy_protocol_detection) {
			return new ProxyServer(options, listener);
		} else {
			const server = new Server(options, listener);
			server.init(net);
			return server;
		}
	}

	public static createSession(options: { url?: any; hostname?: any; port?: any; protocol?: any; }, listener: (arg0: Session) => void) {
		let clientOptions: any = {};
		if (arguments.length > 1 && typeof listener != 'function') {
			clientOptions = {
				host: options,
				port: listener
			};
			listener = arguments[3];
		} else if (typeof options == 'string') {
			clientOptions = options;
			clientOptions.host = clientOptions.slashes ? clientOptions.hostname : options;
			clientOptions.tls = clientOptions.protocol === 'ssmpp:';
		} else if (typeof options == 'function') {
			listener = options;
		} else {
			clientOptions = options || {};
			if (clientOptions.url) {
				options.url = clientOptions.url;
				clientOptions.host = options.hostname;
				clientOptions.port = options.port;
				clientOptions.tls = options.protocol === 'ssmpp:';
			}
		}
		if (clientOptions.tls && !clientOptions.hasOwnProperty("rejectUnauthorized")) {
			clientOptions.rejectUnauthorized = false; // Allow self signed certificates by default
		}
		clientOptions.port = clientOptions.port ?? (clientOptions.tls ? 3550 : 2775);
		clientOptions.debug = clientOptions.debug ?? false;
		clientOptions.connectTimeout = clientOptions.connectTimeout ?? 30000;

		let session = new Session(clientOptions);
		if (listener) {
			session.on(clientOptions.tls ? 'secureConnect' : 'connect', () => {
				listener(session);
			});
		}

		return session;
	};
}

export interface Options extends net.TcpSocketConnectOpts {
	key?: any;
	cert?: any;
	isProxiedServer?: boolean;
	tls?: any;
	debugListener?: any;
	debug?: boolean,
	enable_proxy_protocol_detection?: boolean;
    connectTimeout?: number;
    socket?: net.Socket | tls.TLSSocket | proxy.Server.Socket
    autoPrependBuffer?: any;
    auto_enquire_link_period?: number;
    command_status?: number;
    sequence_number?: number;
    id?: string;
    command?: string;
    tag?: string;
}
