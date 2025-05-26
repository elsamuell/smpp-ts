"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const events_1 = require("events");
const pdu_1 = require("./pdu");
const defs_1 = require("./defs");
const net = require("net");
const tls = require("tls");
class Session extends events_1.EventEmitter {
    createShortcut(command) {
        return (options, responseCallback, sendCallback, failureCallback) => {
            if (typeof options == 'function') {
                sendCallback = responseCallback;
                responseCallback = options;
                options = {};
            }
            const pdu = new pdu_1.PDU(command, options);
            return this.send(pdu, responseCallback, sendCallback, failureCallback);
        };
    }
    ;
    addCommand(command, options) {
        options.command = command;
        defs_1.Defs.commands[command] = options;
        defs_1.Defs.commandsById[options.id] = options;
        Object.assign(this, {
            [command]: this.createShortcut(command)
        });
    }
    ;
    constructor(options) {
        var _a;
        super();
        this.sequence = 0;
        this.paused = false;
        this.closed = false;
        this.proxyProtocolProxy = null;
        this.busy = false;
        this.callbacks = {};
        this.id = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        this.prevBytesRead = 0;
        this.interval = 0;
        this.rootSocket = () => {
            if (this.socket._parent)
                return this.socket._parent;
            return this.socket;
        };
        for (const command in defs_1.Defs.commands) {
            Object.assign(this, {
                [command]: this.createShortcut(command)
            });
        }
        this.options = options || {};
        let connectTimeout;
        if (options.socket) {
            this.mode = "server";
            this.socket = options === null || options === void 0 ? void 0 : options.socket;
            this.remoteAddress = (_a = this.rootSocket().remoteAddress) !== null && _a !== void 0 ? _a : this.remoteAddress;
            this.remotePort = this.rootSocket().remotePort;
            this.proxyProtocolProxy = this.rootSocket().proxyAddress ? { address: this.rootSocket().proxyAddress, port: this.rootSocket().proxyPort } : false;
        }
        else {
            this.mode = "client";
            let clientTransport = net;
            if (options.tls) {
                clientTransport = tls;
            }
            if (options.hasOwnProperty("connectTimeout") && (options === null || options === void 0 ? void 0 : options.connectTimeout) > 0) {
                connectTimeout = setTimeout(() => {
                    if (this.socket) {
                        const e = new Error("Timeout of " + options.connectTimeout + "ms while connecting to " +
                            this.options.host + ":" + this.options.port);
                        const ec = Object.assign(Object.assign({}, e), { code: "ETIMEOUT", timeout: options.connectTimeout });
                        this.socket.destroy(e);
                    }
                }, options.connectTimeout);
            }
            this.socket = clientTransport.connect(this.options);
            this.socket.on('connect', () => {
                var _a, _b;
                clearTimeout(connectTimeout);
                this.remoteAddress = (_a = this.rootSocket().remoteAddress) !== null && _a !== void 0 ? _a : this.remoteAddress;
                this.remotePort = (_b = this.rootSocket().remotePort) !== null && _b !== void 0 ? _b : this.remoteAddress;
                this.debug("server.connected", "connected to server", { secure: options.tls });
                this.emitMetric("server.connected", 1);
                this.emit('connect');
                if (this.options.auto_enquire_link_period) {
                    this.interval = setInterval(() => {
                        this.socket.enquire_link();
                    }, this.options.auto_enquire_link_period);
                }
            });
            this.socket.on('secureConnect', () => {
                this.emit('secureConnect');
            });
        }
        this.socket.on('readable', () => {
            var _a;
            const bytesRead = ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.bytesRead) - this.prevBytesRead;
            if (bytesRead > 0) {
                this.debug("socket.data.in", null, { bytes: bytesRead });
                this.emitMetric("socket.data.in", bytesRead, { bytes: bytesRead });
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
            }
            else {
                this.debug("server.disconnected", "disconnected from server");
                this.emitMetric("server.disconnected", 1);
            }
            this.emit('close');
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = 0;
            }
        });
        this.socket.on('error', (e) => {
            clearTimeout(connectTimeout);
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = 0;
            }
            this.debug("socket.error", e.message, e);
            this.emitMetric("socket.error", 1, { error: e });
            this.emit('error', e);
        });
    }
    emitMetric(event, value, payload) {
        var _a, _b, _c, _d, _e;
        this.emit('metrics', event !== null && event !== void 0 ? event : null, value !== null && value !== void 0 ? value : null, payload !== null && payload !== void 0 ? payload : {}, {
            mode: (_a = this.mode) !== null && _a !== void 0 ? _a : null,
            remoteAddress: (_b = this.remoteAddress) !== null && _b !== void 0 ? _b : null,
            remotePort: (_c = this.remotePort) !== null && _c !== void 0 ? _c : null,
            remoteTls: (_d = this.options.tls) !== null && _d !== void 0 ? _d : false,
            sessionId: (_e = this.id) !== null && _e !== void 0 ? _e : null,
            session: this
        });
    }
    debug(type, msg, payload) {
        if (type === undefined)
            type = null;
        if (msg === undefined)
            msg = null;
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
            };
            let now = new Date();
            let logBuffer = now.toISOString() +
                " - " + (this.mode === "server" ? "srv" : "cli") +
                " - " + this.id +
                " - " + (coloredTypes.hasOwnProperty(type) ? coloredTypes[type] + type + coloredTypes.reset : type) +
                " - " + (msg !== null ? msg : "") +
                " - " + coloredTypes.dim + (payload !== undefined ? JSON.stringify(payload) : "") + coloredTypes.reset;
            if (this.remoteAddress)
                logBuffer += " - [" + this.remoteAddress + "]";
            console.log(logBuffer);
        }
        if (this.options.debugListener instanceof Function) {
            this.options.debugListener(type, msg, payload);
        }
        this.emit('debug', type, msg, payload);
    }
    extractPDUs() {
        if (this.busy) {
            return;
        }
        this.busy = true;
        let pdu;
        while (!this.paused) {
            try {
                if (!this.command_length) {
                    this.command_length = pdu_1.PDU.commandLength(this.socket);
                    if (!this.command_length) {
                        break;
                    }
                }
                pdu = pdu_1.PDU.fromStream(this.socket, this.command_length);
                if (!pdu) {
                    break;
                }
                this.debug("pdu.command.in", pdu.command, pdu);
                this.emitMetric("pdu.command.in", 1, pdu);
            }
            catch (e) {
                this.debug("pdu.command.error", e === null || e === void 0 ? void 0 : e.message, e);
                this.emitMetric("pdu.command.error", 1, { error: e });
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
    }
    ;
    send(pdu, responseCallback, sendCallback, failureCallback) {
        if (!this.socket.writable) {
            const errorObject = {
                error: 'Socket is not writable',
                errorType: 'socket_not_writable'
            };
            this.debug('socket.data.error', null, errorObject);
            this.emitMetric("socket.data.error", 1, errorObject);
            if (failureCallback) {
                pdu.command_status = defs_1.Defs.errors.ESME_RSUBMITFAIL;
                failureCallback(pdu);
            }
            return false;
        }
        if (!pdu.isResponse()) {
            if (!pdu.sequence_number) {
                if (this.sequence == 0x7FFFFFFF) {
                    this.sequence = 0;
                }
                pdu.sequence_number = ++this.sequence;
            }
            if (responseCallback) {
                this.callbacks[pdu.sequence_number] = responseCallback;
            }
        }
        else if (responseCallback && !sendCallback) {
            sendCallback = responseCallback;
        }
        this.debug('pdu.command.out', pdu.command, pdu);
        this.emitMetric("pdu.command.out", 1, pdu);
        const buffer = pdu.toBuffer();
        this.socket.write(buffer, (err) => {
            if (err) {
                this.debug('socket.data.error', null, {
                    error: 'Cannot write command ' + pdu.command + ' to socket',
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
                    pdu.command_status = defs_1.Defs.errors.ESME_RSUBMITFAIL;
                    failureCallback(pdu, err);
                }
            }
            else {
                this.debug("socket.data.out", null, { bytes: buffer.length, error: err });
                this.emitMetric("socket.data.out", buffer.length, { bytes: buffer.length });
                this.emit('send', pdu);
                if (sendCallback) {
                    sendCallback(pdu);
                }
            }
        });
        return true;
    }
    ;
    pause() {
        this.paused = true;
    }
    ;
    resume() {
        this.paused = false;
        this.extractPDUs();
    }
    ;
    close(callback) {
        if (callback) {
            if (this.closed) {
                callback();
            }
            else {
                this.socket.once('close', callback);
            }
        }
        this.socket.end();
    }
    ;
    destroy(callback) {
        if (callback) {
            if (this.closed) {
                callback();
            }
            else {
                this.socket.once('close', callback);
            }
        }
        this.socket.destroy();
    }
    ;
}
exports.Session = Session;
//# sourceMappingURL=session.js.map