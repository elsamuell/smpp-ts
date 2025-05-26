import { Options } from './smpp';
export declare class PDU {
    command_length: number;
    command_id: number;
    command_status: number;
    sequence_number: number;
    command: string;
    [key: string]: any;
    static readonly maxLength = 16384;
    constructor(command?: any, options?: Partial<Options>);
    static commandLength(stream: any): any;
    static fromStream(stream: any, commandLength: number): PDU;
    isResponse(): boolean;
    response(options?: any): PDU;
    fromBuffer(buffer: Buffer): any;
    private filter;
    private initBuffer;
    toBuffer(): Buffer<ArrayBuffer>;
}
