"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMPP = void 0;
const defs_1 = require("./defs");
const net = require("net");
const tls = require("tls");
const findhit_proxywrap_1 = require("findhit-proxywrap");
const session_1 = require("./session");
const proxyTransport = (0, findhit_proxywrap_1.proxy)(net, {
    strict: false,
    ignoreStrictExceptions: true
});
const proxyTlsTransport = (0, findhit_proxywrap_1.proxy)(tls, {
    strict: false,
    ignoreStrictExceptions: true
});
class Server extends net.Server {
    constructor(options, listener) {
        super();
        this.sessions = [];
        if (typeof options == 'function') {
            listener = options;
            options = {};
        }
        else {
            options = options || {};
        }
        if (listener) {
            this.on('session', listener);
        }
        this.tls = options.key && options.cert;
        options.tls = this.tls != null;
        this.options = options;
        this.on("proxiedConnection", (socket) => {
            socket.proxiedConnection = true;
        });
    }
    init(transport) {
        var _a;
        transport.Server.call(this, this.options, (socket) => {
            var _a, _b, _c, _d, _e;
            const session = new session_1.Session({
                socket: socket,
                tls: this.options.tls,
                debug: this.options.debug,
                debugListener: (_a = this.options.debugListener) !== null && _a !== void 0 ? _a : null
            });
            session.server = this;
            if (socket.savedEmit) {
                socket.emit = socket.savedEmit;
                socket.savedEmit = null;
            }
            session.debug("client.connected", "client has connected", {
                secure: (_b = this.options) === null || _b === void 0 ? void 0 : _b.tls,
                proxiedServer: (_c = this.options) === null || _c === void 0 ? void 0 : _c.isProxiedServer,
                proxiedConnection: (_e = (_d = socket.proxiedConnection) !== null && _d !== void 0 ? _d : (socket._parent ? socket._parent.proxiedConnection : false)) !== null && _e !== void 0 ? _e : false,
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
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.isProxiedServer) {
            this.on("connection", (socket) => {
                socket.on("error", (e) => {
                    this.emit("error", e);
                });
                if (this.options.autoPrependBuffer) {
                    socket.unshift(this.options.autoPrependBuffer);
                }
                this.options.socket.savedEmit = socket.emit;
            });
        }
    }
}
class SecureServer extends tls.Server {
    constructor(options, listener) {
        super();
        const server = Server.call(this, options, listener);
        server.init(tls);
    }
}
class ProxyServer extends proxyTransport.Server {
    constructor(options, listener) {
        super();
        options.isProxiedServer = true;
        const server = Server.call(this, options, listener);
        server.init(proxyTransport);
    }
}
class ProxySecureServer extends proxyTlsTransport.Server {
    constructor(options, listener) {
        super();
        options.isProxiedServer = true;
        const server = Server.call(this, options, listener);
        server.init(proxyTlsTransport);
    }
}
for (let key in defs_1.Defs) {
    exports[key] = defs_1.Defs[key];
}
for (let error in defs_1.Defs.errors) {
    exports[error] = defs_1.Defs.errors[error];
}
for (let key in defs_1.Defs.consts) {
    exports[key] = defs_1.Defs.consts[key];
}
function addTLV(tag, options) {
    options.tag = tag;
    defs_1.Defs.tlvs[tag] = options;
    defs_1.Defs.tlvsById[options.id] = options;
}
;
class SMPP {
    static connect(options) {
        return new session_1.Session(options);
    }
    static createServer(options, listener) {
        if (typeof options == 'function') {
            listener = options;
            options = {};
        }
        else {
            options = options || {};
        }
        if ((options === null || options === void 0 ? void 0 : options.key) && (options === null || options === void 0 ? void 0 : options.cert)) {
            if (options.enable_proxy_protocol_detection) {
                return new ProxySecureServer(options, listener);
            }
            else {
                return new SecureServer(options, listener);
            }
        }
        else if (options.enable_proxy_protocol_detection) {
            return new ProxyServer(options, listener);
        }
        else {
            const server = new Server(options, listener);
            server.init(net);
            return server;
        }
    }
    static createSession(options, listener) {
        var _a, _b, _c;
        let clientOptions = {};
        if (arguments.length > 1 && typeof listener != 'function') {
            clientOptions = {
                host: options,
                port: listener
            };
            listener = arguments[3];
        }
        else if (typeof options == 'string') {
            clientOptions = options;
            clientOptions.host = clientOptions.slashes ? clientOptions.hostname : options;
            clientOptions.tls = clientOptions.protocol === 'ssmpp:';
        }
        else if (typeof options == 'function') {
            listener = options;
        }
        else {
            clientOptions = options || {};
            if (clientOptions.url) {
                options.url = clientOptions.url;
                clientOptions.host = options.hostname;
                clientOptions.port = options.port;
                clientOptions.tls = options.protocol === 'ssmpp:';
            }
        }
        if (clientOptions.tls && !clientOptions.hasOwnProperty("rejectUnauthorized")) {
            clientOptions.rejectUnauthorized = false;
        }
        clientOptions.port = (_a = clientOptions.port) !== null && _a !== void 0 ? _a : (clientOptions.tls ? 3550 : 2775);
        clientOptions.debug = (_b = clientOptions.debug) !== null && _b !== void 0 ? _b : false;
        clientOptions.connectTimeout = (_c = clientOptions.connectTimeout) !== null && _c !== void 0 ? _c : 30000;
        let session = new session_1.Session(clientOptions);
        if (listener) {
            session.on(clientOptions.tls ? 'secureConnect' : 'connect', () => {
                listener(session);
            });
        }
        return session;
    }
    ;
}
exports.SMPP = SMPP;
SMPP.addTLV = addTLV;
//# sourceMappingURL=smpp.js.map