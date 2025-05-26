"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDU = void 0;
const defs_1 = require("./defs");
const pduHeadParams = [
    'command_length',
    'command_id',
    'command_status',
    'sequence_number'
];
class PDU {
    constructor(command, options) {
        var _a, _b, _c;
        if (Buffer.isBuffer(command)) {
            return this.fromBuffer(command);
        }
        options = options || {};
        this.command = command;
        this.command_length = 0;
        this.command_id = defs_1.Defs.commands[command].id;
        this.command_status = (_a = options.command_status) !== null && _a !== void 0 ? _a : 0;
        this.sequence_number = (_b = options.sequence_number) !== null && _b !== void 0 ? _b : 0;
        if (this.command_status) {
            return;
        }
        let params = (_c = defs_1.Defs.commands[command].params) !== null && _c !== void 0 ? _c : {};
        for (const key in params) {
            if (key in options) {
                this[key] = options[key];
            }
            else if ('default' in params[key]) {
                this[key] = params[key].default;
            }
            else {
                this[key] = params[key].type.default;
            }
        }
        for (const key in options)
            if (key in defs_1.Defs.tlvs && !(key in params)) {
                this[key] = options[key];
            }
    }
    static commandLength(stream) {
        const buffer = stream.read(4);
        if (!buffer) {
            return false;
        }
        const command_length = buffer.readUInt32BE(0);
        if (command_length > this.maxLength) {
            throw Error('PDU length was too large (' + command_length +
                ', maximum is ' + this.maxLength + ').');
        }
        return command_length;
    }
    ;
    static fromStream(stream, commandLength) {
        const buffer = stream === null || stream === void 0 ? void 0 : stream.read(commandLength - 4);
        if (!buffer) {
            return undefined;
        }
        const commandLengthBuffer = Buffer.alloc(4);
        commandLengthBuffer.writeUInt32BE(commandLength, 0);
        const pduBuffer = Buffer.concat([commandLengthBuffer, buffer]);
        return new PDU(pduBuffer);
    }
    isResponse() {
        return !!(this.command_id & 0x80000000);
    }
    ;
    response(options) {
        options = options !== null && options !== void 0 ? options : {};
        options.sequence_number = this.sequence_number;
        if (this.command == 'unknown') {
            if (!('command_status' in options)) {
                options.command_status = defs_1.Defs.errors.ESME_RINVCMDID;
            }
            return new PDU('generic_nack', options);
        }
        return new PDU(this.command + '_resp', options);
    }
    ;
    fromBuffer(buffer) {
        var _a, _b, _c, _d;
        if (buffer.length < 16 || buffer.length < buffer.readUInt32BE(0)) {
            return undefined;
        }
        pduHeadParams.forEach((key, i) => {
            this[key] = buffer.readUInt32BE(i * 4);
        });
        let params, offset = pduHeadParams.length * 4;
        if (this.command_length > PDU.maxLength) {
            throw Error('PDU length was too large (' + this.command_length +
                ', maximum is ' + PDU.maxLength + ').');
        }
        if (defs_1.Defs.commandsById[this.command_id]) {
            this.command = defs_1.Defs.commandsById[this.command_id].command;
            params = (_a = defs_1.Defs.commands[this.command].params) !== null && _a !== void 0 ? _a : {};
        }
        else {
            this.command = 'unknown';
            return;
        }
        for (const key in params) {
            if (offset >= this.command_length) {
                break;
            }
            this[key] = params[key].type.read(buffer, offset);
            offset += params[key].type.size(this[key]);
        }
        while (offset + 4 <= this.command_length) {
            let tlvId = buffer.readUInt16BE(offset);
            let length = buffer.readUInt16BE(offset + 2);
            offset += 4;
            let tlv = defs_1.Defs.tlvsById[tlvId];
            if (!tlv) {
                this[tlvId] = buffer.subarray(offset, offset + length);
                offset += length;
                continue;
            }
            const tag = (_c = ((_b = defs_1.Defs.commands[this.command].tlvMap) !== null && _b !== void 0 ? _b : {})[tlv.tag]) !== null && _c !== void 0 ? _c : tlv.tag;
            if (tlv.multiple) {
                (_d = this[tag]) !== null && _d !== void 0 ? _d : (this[tag] = []);
                this[tag].push(tlv.type.read(buffer, offset, length));
            }
            else {
                this[tag] = tlv.type.read(buffer, offset, length);
            }
            offset += length;
        }
        this.filter('decode');
    }
    ;
    filter(arg) {
        var _a;
        const params = (_a = defs_1.Defs.commands[this.command].params) !== null && _a !== void 0 ? _a : {};
        for (const key in this) {
            if (params[key] && params[key].filter) {
                this[key] = params[key].filter[arg].call(this, this[key]);
            }
            else if (defs_1.Defs.tlvs[key] && defs_1.Defs.tlvs[key].filter) {
                if (defs_1.Defs.tlvs[key].multiple) {
                    this[key].forEach((value, i) => {
                        this[key][i] = defs_1.Defs.tlvs[key].filter[arg].call(this, value, true);
                    });
                }
                else if (key === 'message_payload') {
                    const skipUdh = this.short_message && this.short_message.message && this.short_message.message.length;
                    this[key] = defs_1.Defs.tlvs[key].filter[arg].call(this, this[key], skipUdh);
                }
                else {
                    this[key] = defs_1.Defs.tlvs[key].filter[arg].call(this, this[key], true);
                }
            }
        }
    }
    initBuffer() {
        const buffer = Buffer.alloc(this.command_length);
        pduHeadParams === null || pduHeadParams === void 0 ? void 0 : pduHeadParams.forEach((key, i) => {
            buffer.writeUInt32BE(this[key], i * 4);
        });
        return buffer;
    }
    ;
    toBuffer() {
        var _a, _b;
        this.command_length = pduHeadParams.length * 4;
        if (this.command_status) {
            return this.initBuffer();
        }
        this.filter('encode');
        const params = (_a = defs_1.Defs.commands[this.command].params) !== null && _a !== void 0 ? _a : {};
        for (const key in this) {
            if (params[key]) {
                this.command_length += params[key].type.size(this[key]);
            }
            else if (defs_1.Defs.tlvs[key]) {
                const values = ((_b = defs_1.Defs.tlvs[key]) === null || _b === void 0 ? void 0 : _b.multiple) ? this[key] : [this[key]];
                values === null || values === void 0 ? void 0 : values.forEach((value) => {
                    this.command_length += defs_1.Defs.tlvs[key].type.size(value) + 4;
                });
            }
        }
        const buffer = this.initBuffer();
        let offset = pduHeadParams.length * 4;
        for (const key in params) {
            params[key].type.write(this[key], buffer, offset);
            offset += params[key].type.size(this[key]);
        }
        for (const key in this)
            if (defs_1.Defs.tlvs[key] && !(key in params)) {
                const values = defs_1.Defs.tlvs[key].multiple ? this[key] : [this[key]];
                values === null || values === void 0 ? void 0 : values.forEach(function (value) {
                    buffer.writeUInt16BE(defs_1.Defs.tlvs[key].id, offset);
                    const length = defs_1.Defs.tlvs[key].type.size(value);
                    buffer.writeUInt16BE(length, offset + 2);
                    offset += 4;
                    defs_1.Defs.tlvs[key].type.write(value, buffer, offset);
                    offset += length;
                });
            }
        return buffer;
    }
}
exports.PDU = PDU;
PDU.maxLength = 16384;
//# sourceMappingURL=pdu.js.map