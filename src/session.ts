
import { EventEmitter } from 'events';
import { PDU } from './pdu';
import { Defs } from './defs';
import * as net  from 'net';
import * as tls from 'tls';
import { Options } from './smpp';

export class Session extends EventEmitter {
	public server: net.Server | tls.Server | undefined;
	public options: Partial<Options>;
	public sequence: number = 0;
	public paused: boolean = false;
	public closed: boolean = false;
	public remoteAddress: string | undefined;
	public remotePort: number | undefined;
	public proxyProtocolProxy: any = null;
	private busy = false;
	private callbacks = {};
	private command_length: number;
	private mode: string;
	private id = Math.floor(Math.random() * (999999 - 100000)) + 100000; // random session id
	private prevBytesRead = 0;
	public socket: any;
    private interval: any = 0;

	rootSocket = () => {
		if (this.socket._parent) return this.socket._parent;
		return this.socket;
	};

	createShortcut(command: string) {
		return (options: Partial<Options>, responseCallback, sendCallback, failureCallback) => {
			if (typeof options == 'function') {
				sendCallback = responseCallback;
				responseCallback = options;
				options = {} as Options;
			}
			const pdu = new PDU(command, options);
			return this.send(pdu, responseCallback, sendCallback, failureCallback);
		};
	};

	addCommand(command: string, options: Partial<Options>) {
		options.command = command;
		Defs.commands[command] = options;
		Defs.commandsById[options.id] = options;
		Object.assign(this, {
			[command]: this.createShortcut(command)
		})
	};

	constructor(options: Partial<Options>){
		super();
		for (const command in Defs.commands) {
			Object.assign(this, {
				[command]: this.createShortcut(command)
			})
		}
		this.options = options || {};
		let connectTimeout;
		if (options.socket) {
			// server mode / socket is already connected.
			this.mode = "server";
			this.socket = options?.socket;
			this.remoteAddress = this.rootSocket().remoteAddress ?? this.remoteAddress;
			this.remotePort = this.rootSocket().remotePort;
			this.proxyProtocolProxy = this.rootSocket().proxyAddress ? { address: this.rootSocket().proxyAddress, port: this.rootSocket().proxyPort } : false;
		} else {
			// client mode
			this.mode = "client";
			let clientTransport: any = net;
			if (options.tls) {
				clientTransport = tls;
			}
			if (options.hasOwnProperty("connectTimeout") && options?.connectTimeout > 0) {
				connectTimeout = setTimeout(() => {
					if (this.socket) {
						const e = new Error("Timeout of " + options.connectTimeout + "ms while connecting to " +
							this.options.host + ":" + this.options.port);
						const ec = {
							...e,
							code: "ETIMEOUT",
							timeout: options.connectTimeout
						}
						this.socket.destroy(e);

					}
				}, options.connectTimeout);
			}
			this.socket = clientTransport.connect(this.options);
			this.socket.on('connect', () => {
				clearTimeout(connectTimeout);
				this.remoteAddress = this.rootSocket().remoteAddress ?? this.remoteAddress;
				this.remotePort = this.rootSocket().remotePort ?? this.remoteAddress;
				this.debug("server.connected", "connected to server", {secure: options.tls});
				this.emitMetric("server.connected", 1);
				this.emit('connect'); //should emit the session, but it would break BC
				if(this.options.auto_enquire_link_period) {
					this.interval = setInterval(() => {
						this.socket.enquire_link();
					}, this.options.auto_enquire_link_period);
				}
			});
			this.socket.on('secureConnect', () => {
				this.emit('secureConnect'); //should emit the session, but it would break BC
			});
		}

		this.socket.on('readable', () => {
			const bytesRead = this.socket?.bytesRead - this.prevBytesRead;
			if ( bytesRead > 0 ) {
				// on disconnections the readable event receives 0 bytes, we do not want to debug that
				this.debug("socket.data.in", null, {bytes: bytesRead});
				this.emitMetric("socket.data.in", bytesRead, {bytes: bytesRead});
				this.prevBytesRead = this.socket.bytesRead;
			}
			this.extractPDUs();
		});

		this.socket.on('close', () => {
			this.closed = true;
			clearTimeout(connectTimeout);
			if (this.mode === "server") {
				this.debug("client.disconnected", "client has disconnected");
				this.emitMetric("client.disconnected", 1);
			} else {
				this.debug("server.disconnected", "disconnected from server");
				this.emitMetric("server.disconnected", 1);
			}
			this.emit('close');
			if(this.interval) {
				clearInterval(this.interval);
				this.interval = 0;
			}
		});
		
		this.socket.on('error', (e) =>{
			clearTimeout(connectTimeout);
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = 0;
			}
			this.debug("socket.error", e.message, e);
			this.emitMetric("socket.error", 1, {error: e});
			this.emit('error', e); // Emitted errors will kill the program if they're not captured.
		});
	}

	public emitMetric(event: any, value?: any, payload?: any) {
		this.emit('metrics', event ?? null, value ?? null, payload ?? {}, {
			mode: this.mode ?? null,
			remoteAddress: this.remoteAddress ?? null,
			remotePort: this.remotePort ?? null,
			remoteTls: this.options.tls ?? false,
			sessionId: this.id ?? null,
			session: this
		});
	}

	public debug(type: any, msg?: any, payload?: any) {
		if (type === undefined) type = null;
		if (msg === undefined) msg = null;
		if (this.options.debug) {
			let coloredTypes = {
				"reset": "\x1b[0m",
				"dim": "\x1b[2m",
				"client.connected": "\x1b[1m\x1b[34m",
				"client.disconnected": "\x1b[1m\x1b[31m",
				"server.connected": "\x1b[1m\x1b[34m",
				"server.disconnected": "\x1b[1m\x1b[31m",
				"pdu.command.in": "\x1b[36m",
				"pdu.command.out": "\x1b[32m",
				"pdu.command.error": "\x1b[41m\x1b[30m",
				"socket.error": "\x1b[41m\x1b[30m",
				"socket.data.in": "\x1b[2m",
				"socket.data.out": "\x1b[2m",
				"metrics": "\x1b[2m",
			}
			let now = new Date();
			let logBuffer = now.toISOString() +
				" - " + (this.mode === "server" ? "srv" : "cli") +
				" - " + this.id +
				" - " + (coloredTypes.hasOwnProperty(type) ? coloredTypes[type] + type + coloredTypes.reset : type) +
				" - " + (msg !== null ? msg : "" ) +
				" - " + coloredTypes.dim + (payload !== undefined ? JSON.stringify(payload) : "") + coloredTypes.reset;
			if (this.remoteAddress) logBuffer += " - [" + this.remoteAddress + "]"
			console.log( logBuffer );
		}
		if (this.options.debugListener instanceof Function) {
			this.options.debugListener(type, msg, payload);
		}
		this.emit('debug', type, msg, payload);
	}

	private extractPDUs() {
		if (this.busy) {
			return;
		}
		this.busy = true;
		let pdu: PDU;
		while (!this.paused) {
			try {
				if(!this.command_length) {
					this.command_length = PDU.commandLength(this.socket);
					if(!this.command_length) {
						break;
					}
				}
				pdu = PDU.fromStream(this.socket, this.command_length);
				if (!pdu) {
					break;
				}
				this.debug("pdu.command.in", pdu.command, pdu);
				this.emitMetric("pdu.command.in", 1, pdu);
			} catch (e: any) {
				this.debug("pdu.command.error", e?.message, e);
				this.emitMetric("pdu.command.error", 1, {error: e});
				this.emit('error', e);
				return;
			}
			this.command_length = null;
			this.emit('pdu', pdu);
			this.emit(pdu.command, pdu);
			if (pdu.isResponse() && this.callbacks[pdu.sequence_number]) {
				this.callbacks[pdu.sequence_number](pdu);
				delete this.callbacks[pdu.sequence_number];
			}
		}
		this.busy = false;
	};

	public send(pdu: PDU, responseCallback?: any, sendCallback?: any, failureCallback?: any) {
		if (!this.socket.writable) {
			const errorObject = {
				error: 'Socket is not writable',
				errorType: 'socket_not_writable'
			}
			this.debug('socket.data.error', null, errorObject);
			this.emitMetric("socket.data.error", 1, errorObject);
			if (failureCallback) {
				pdu.command_status = Defs.errors.ESME_RSUBMITFAIL;
				failureCallback(pdu);
			}
			return false;
		}
		if (!pdu.isResponse()) {
			// when server/session pair is used to proxy smpp
			// traffic, the sequence_number will be provided by
			// client otherwise we generate it automatically
			if (!pdu.sequence_number) {
				if (this.sequence == 0x7FFFFFFF) {
					this.sequence = 0;
				}
				pdu.sequence_number = ++this.sequence;
			}
			if (responseCallback) {
				this.callbacks[pdu.sequence_number] = responseCallback;
			}
		} else if (responseCallback && !sendCallback) {
			sendCallback = responseCallback;
		}
		this.debug('pdu.command.out', pdu.command, pdu);
		this.emitMetric("pdu.command.out", 1, pdu);
		const buffer = pdu.toBuffer();
		this.socket.write(buffer, (err) => {
			if (err) {
				this.debug('socket.data.error', null, {
					error:'Cannot write command ' + pdu.command + ' to socket',
					errorType: 'socket_write_error'
				});
				this.emitMetric("socket.data.error", 1, {
					error: err,
					errorType: 'socket_write_error',
					pdu: pdu
				});
				if (!pdu.isResponse() && this.callbacks[pdu.sequence_number]) {
					delete this.callbacks[pdu.sequence_number];
				}
				if (failureCallback) {
					pdu.command_status = Defs.errors.ESME_RSUBMITFAIL;
					failureCallback(pdu, err);
				}
			} else {
				this.debug("socket.data.out", null, {bytes: buffer.length, error: err});
				this.emitMetric("socket.data.out", buffer.length, {bytes: buffer.length});
				this.emit('send', pdu);
				if (sendCallback) {
					sendCallback(pdu);
				}
			}
		});
		return true;
	};

	public pause() {
		this.paused = true;
	};

	public resume() {
		this.paused = false;
		this.extractPDUs();
	};

	public close(callback) {
		if (callback) {
			if (this.closed) {
				callback();
			} else {
				this.socket.once('close', callback);
			}
		}
		this.socket.end();
	};

	public destroy(callback) {
		if (callback) {
			if (this.closed) {
				callback();
			} else {
				this.socket.once('close', callback);
			}
		}
		this.socket.destroy();
	};
}