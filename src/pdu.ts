import { Defs } from './defs'
import { Options } from './smpp';

const pduHeadParams = [
	'command_length',
	'command_id',
	'command_status',
	'sequence_number'
];

export class PDU {

    command_length: number;
    command_id: number;
    command_status: number;
    sequence_number: number;
    command: string;
    [key: string]: any;

    static readonly maxLength = 16384;
    constructor(command?: any, options?: Partial<Options>) {
        if (Buffer.isBuffer(command)) {
            return this.fromBuffer(command);
        }
        options = options || {} as Options;
        this.command = command;
        this.command_length = 0;
        this.command_id = Defs.commands[command].id;
        this.command_status = options.command_status ?? 0;
        this.sequence_number = options.sequence_number ?? 0;
        if (this.command_status) {
            return;
        }
        let params = Defs.commands[command].params ?? {};
        for (const key in params) {
            if (key in options) {
                this[key] = options[key];
            } else if ('default' in params[key]) {
                this[key] = params[key].default;
            } else {
                this[key] = params[key].type.default;
            }
        }
        for (const key in options) if (key in Defs.tlvs && !(key in params)) {
            this[key] = options[key];
        }
    }
        
    public static commandLength(stream) {
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
    };


    public static fromStream(stream: any, commandLength: number) {
        const buffer = stream?.read(commandLength - 4);
        if (!buffer) {
            return undefined;
        }
        const commandLengthBuffer = Buffer.alloc(4);
        commandLengthBuffer.writeUInt32BE(commandLength, 0);
        const pduBuffer = Buffer.concat([commandLengthBuffer, buffer]);
        return new PDU(pduBuffer);
    }

    public isResponse() {
        return !!(this.command_id & 0x80000000);
    };

    public response(options?: any) {
        options = options ?? {};
        options.sequence_number = this.sequence_number;
        if (this.command == 'unknown') {
            if (!('command_status' in options)) {
                options.command_status = Defs.errors.ESME_RINVCMDID;
            }
            return new PDU('generic_nack', options);
        }
        return new PDU(this.command + '_resp', options);
    };

    public fromBuffer(buffer: Buffer) {
        if (buffer.length < 16 || buffer.length < buffer.readUInt32BE(0)) {
            return undefined;
        }
        pduHeadParams.forEach((key, i) =>{
            this[key] = buffer.readUInt32BE(i * 4);
        });
        //Since each pduHeaderParam is 4 bytes/octets, the offset is equal to the total length of the
        //pduHeadParams*4, its better to use that basis for maintenance.
        let params, offset = pduHeadParams.length * 4;
        if (this.command_length > PDU.maxLength) {
            throw Error('PDU length was too large (' + this.command_length +
                ', maximum is ' + PDU.maxLength + ').');
        }
        if (Defs.commandsById[this.command_id]) {
            this.command = Defs.commandsById[this.command_id].command;
            params = Defs.commands[this.command].params ?? {};
        } else {
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
            let tlv = Defs.tlvsById[tlvId];
            if (!tlv) {
                this[tlvId] = buffer.subarray(offset, offset + length);
                offset += length;
                continue;
            }
            const tag = (Defs.commands[this.command].tlvMap ?? {})[tlv.tag] ?? tlv.tag;
            if (tlv.multiple) {
                this[tag] ??= [];
                this[tag].push(tlv.type.read(buffer, offset, length));
            } else {
                this[tag] = tlv.type.read(buffer, offset, length);
            }
            offset += length;
        }
        this.filter('decode');
    };

    private filter(arg: string) {
        const params = Defs.commands[this.command].params ?? {};
        for (const key in this) {
            if (params[key] && params[key].filter) {
                this[key] = params[key].filter[arg].call(this, this[key]);
            } else if (Defs.tlvs[key] && Defs.tlvs[key].filter) {
                if (Defs.tlvs[key].multiple) {
                    this[key].forEach((value, i) => {
                        this[key][i] = Defs.tlvs[key].filter[arg].call(this, value, true);
                    });
                } else if (key === 'message_payload') {
                        const skipUdh = this.short_message && this.short_message.message && this.short_message.message.length;
                        this[key] = Defs.tlvs[key].filter[arg].call(this, this[key], skipUdh);
                    } else {
                        this[key] = Defs.tlvs[key].filter[arg].call(this, this[key], true);
                    }
            }
        }
    }

    private initBuffer() {
        const buffer = Buffer.alloc(this.command_length);
        pduHeadParams?.forEach((key, i) => {
            buffer.writeUInt32BE(this[key], i * 4);
        });
        return buffer;
    };

    public toBuffer() {
        //Since each pduHeaderParam is 4 bytes/octets, the offset is equal to the total length of the
        //pduHeadParams*4, its better to use that basis for maintainance.
        this.command_length = pduHeadParams.length * 4 ;
        if (this.command_status) {
            return this.initBuffer();
        }
        this.filter('encode');
        const params = Defs.commands[this.command].params ?? {};
        for (const key in this) {
            if (params[key]) {
                this.command_length += params[key].type.size(this[key]);
            } else if (Defs.tlvs[key]) {
                const values: any = Defs.tlvs[key]?.multiple ? this[key] : [this[key]];
                values?.forEach((value) => {
                    this.command_length += Defs.tlvs[key].type.size(value) + 4;
                });
            }
        }
        const buffer = this.initBuffer();
        //Since each pduHeaderParam is 4 bytes/octets, the offset is equal to the total length of the
        //pduHeadParams*4, its better to use that basis for maintainance.
        let offset = pduHeadParams.length * 4;
        for (const key in params) {
            params[key].type.write(this[key], buffer, offset);
            offset += params[key].type.size(this[key]);
        }
        for (const key in this) if (Defs.tlvs[key] && !(key in params)) {
            const values: any = Defs.tlvs[key].multiple ? this[key] : [this[key]];
            values?.forEach(function(value) {
                buffer.writeUInt16BE(Defs.tlvs[key].id, offset);
                const length = Defs.tlvs[key].type.size(value);
                buffer.writeUInt16BE(length, offset + 2);
                offset += 4;
                Defs.tlvs[key].type.write(value, buffer, offset);
                offset += length;
            });
        }
        return buffer;
    }
}