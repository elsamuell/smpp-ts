import * as net from 'net';
import * as tls from 'tls';
import { proxy } from 'findhit-proxywrap';
import { Session } from './session';
declare const proxyTransport: any;
declare const proxyTlsTransport: any;
declare class Server extends net.Server {
    sessions: Array<Session>;
    tls: any;
    private options;
    constructor(options?: Partial<Options>, listener?: ((listener: any) => void));
    init(transport: any): void;
}
declare class SecureServer extends tls.Server {
    constructor(options: Partial<Options>, listener: ((listener: any) => void));
}
declare class ProxyServer extends proxyTransport.Server {
    constructor(options: Partial<Options>, listener: ((listener: any) => void));
}
declare class ProxySecureServer extends proxyTlsTransport.Server {
    constructor(options: Partial<Options>, listener: ((listener: any) => void));
}
declare function addTLV(tag: string, options: Partial<Options>): void;
export declare class SMPP {
    static readonly addTLV: typeof addTLV;
    static connect(options?: Partial<Options>): Session;
    static createServer(options?: Partial<Options> | ((listener: any) => void), listener?: ((listener: any) => void)): Server | SecureServer | ProxyServer | ProxySecureServer;
    static createSession(options: {
        url?: any;
        hostname?: any;
        port?: any;
        protocol?: any;
    }, listener: (arg0: Session) => void): Session;
}
export interface Options extends net.TcpSocketConnectOpts {
    key?: any;
    cert?: any;
    isProxiedServer?: boolean;
    tls?: any;
    debugListener?: any;
    debug?: boolean;
    enable_proxy_protocol_detection?: boolean;
    connectTimeout?: number;
    socket?: net.Socket | tls.TLSSocket | proxy.Server.Socket;
    autoPrependBuffer?: any;
    auto_enquire_link_period?: number;
    command_status?: number;
    sequence_number?: number;
    id?: string;
    command?: string;
    tag?: string;
}
export {};
