import { Buffer } from 'safer-buffer';
export declare const typesTlv: {
    int8: {
        read: (buffer: any, offset: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: () => number;
        default: number;
    };
    int16: {
        read: (buffer: any, offset: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: () => number;
        default: number;
    };
    int32: {
        read: (buffer: any, offset: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: () => number;
        default: number;
    };
    cstring: {
        read: (buffer: any, offset: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: (value: any) => any;
        default: string;
    };
    string: {
        read: (buffer: any, offset: any, length: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: (value: any) => any;
        default: string;
    };
    buffer: {
        read: (buffer: any, offset: any, length: any) => any;
        write: (value: any, buffer: any, offset: any) => void;
        size: (value: any) => any;
        default: any;
    };
};
export declare class Defs {
    static readonly encodings: {
        ASCII: {
            match: (value: any) => boolean;
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => string;
        };
        LATIN1: {
            match: (value: any) => boolean;
            encode: (value: any) => Buffer<ArrayBufferLike>;
            decode: (value: any) => string;
        };
        UCS2: {
            match: (value: any) => boolean;
            encode: (value: any) => Buffer<ArrayBufferLike>;
            decode: (value: any) => string;
        };
        default: {
            match: (value: any) => boolean;
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => string;
        };
        detect: (value: any) => string | false;
    };
    static readonly filters: {
        time: {
            encode: (value: any) => any;
            decode: (value: any) => any;
        };
        message: {
            encode: (value: any) => any;
            decode: (value: any, skipUdh: any) => any;
        };
        billing_identification: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
        broadcast_area_identifier: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
        broadcast_content_type: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
        broadcast_frequency_interval: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
        callback_num: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
        callback_num_atag: {
            encode: (value: any) => Buffer<ArrayBuffer>;
            decode: (value: any) => any;
        };
    };
    static readonly gsmCoder: {
        GSM: {
            chars: string;
            extChars: string;
            escChars: string;
            charRegex: RegExp;
            charListEnc: {};
            extCharListEnc: {};
            charListDec: {};
            extCharListDec: {};
        };
        GSM_TR: {
            chars: string;
            extCharsEnc: string;
            escCharsEnc: string;
            extCharsDec: string;
            escCharsDec: string;
            charRegex: RegExp;
            charListEnc: {};
            extCharListEnc: {};
            charListDec: {};
            extCharListDec: {};
        };
        GSM_ES: {
            chars: string;
            extChars: string;
            escChars: string;
            charRegex: RegExp;
            charListEnc: {};
            extCharListEnc: {};
            charListDec: {};
            extCharListDec: {};
        };
        GSM_PT: {
            chars: string;
            extCharsEnc: string;
            escCharsEnc: string;
            extCharsDec: string;
            escCharsDec: string;
            charRegex: RegExp;
            charListEnc: {};
            extCharListEnc: {};
            charListDec: {};
            extCharListDec: {};
        };
        getCoder: (encoding: any) => any;
        encode: (string: any, encoding: any) => Buffer<ArrayBuffer>;
        decode: (string: any, encoding: any) => string;
        detect: (string: any) => 0 | 1 | 2 | 3;
    };
    static readonly consts: {
        REGISTERED_DELIVERY: {
            FINAL: number;
            FAILURE: number;
            SUCCESS: number;
            DELIVERY_ACKNOWLEDGEMENT: number;
            USER_ACKNOWLEDGEMENT: number;
            INTERMEDIATE: number;
        };
        ESM_CLASS: {
            DATAGRAM: number;
            FORWARD: number;
            STORE_FORWARD: number;
            MC_DELIVERY_RECEIPT: number;
            DELIVERY_ACKNOWLEDGEMENT: number;
            USER_ACKNOWLEDGEMENT: number;
            CONVERSATION_ABORT: number;
            INTERMEDIATE_DELIVERY: number;
            UDH_INDICATOR: number;
            KANNEL_UDH_INDICATOR: number;
            SET_REPLY_PATH: number;
        };
        MESSAGE_STATE: {
            SCHEDULED: number;
            ENROUTE: number;
            DELIVERED: number;
            EXPIRED: number;
            DELETED: number;
            UNDELIVERABLE: number;
            ACCEPTED: number;
            UNKNOWN: number;
            REJECTED: number;
            SKIPPED: number;
        };
        TON: {
            UNKNOWN: number;
            INTERNATIONAL: number;
            NATIONAL: number;
            NETWORK_SPECIFIC: number;
            SUBSCRIBER_NUMBER: number;
            ALPHANUMERIC: number;
            ABBREVIATED: number;
        };
        NPI: {
            UNKNOWN: number;
            ISDN: number;
            DATA: number;
            TELEX: number;
            LAND_MOBILE: number;
            NATIONAL: number;
            PRIVATE: number;
            ERMES: number;
            INTERNET: number;
            IP: number;
            WAP: number;
        };
        ENCODING: {
            SMSC_DEFAULT: number;
            ASCII: number;
            GSM_TR: number;
            GSM_ES: number;
            GSM_PT: number;
            IA5: number;
            LATIN1: number;
            ISO_8859_1: number;
            BINARY: number;
            JIS: number;
            X_0208_1990: number;
            CYRILLIC: number;
            ISO_8859_5: number;
            HEBREW: number;
            ISO_8859_8: number;
            UCS2: number;
            PICTOGRAM: number;
            ISO_2022_JP: number;
            EXTENDED_KANJI_JIS: number;
            X_0212_1990: number;
            KS_C_5601: number;
        };
        NETWORK: {
            GENERIC: number;
            GSM: number;
            TDMA: number;
            CDMA: number;
        };
        BROADCAST_AREA_FORMAT: {
            NAME: number;
            ALIAS: number;
            ELLIPSOID_ARC: number;
            POLYGON: number;
        };
        BROADCAST_FREQUENCY_INTERVAL: {
            MAX_POSSIBLE: number;
            SECONDS: number;
            MINUTES: number;
            HOURS: number;
            DAYS: number;
            WEEKS: number;
            MONTHS: number;
            YEARS: number;
        };
    };
    static readonly commands: {
        alert_notification: {
            id: number;
            params: {
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                esme_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                esme_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                esme_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_receiver: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                password: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                system_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                interface_version: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: number;
                };
                addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                address_range: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_receiver_resp: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_transmitter: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                password: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                system_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                interface_version: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: number;
                };
                addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                address_range: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_transmitter_resp: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_transceiver: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                password: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                system_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                interface_version: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: number;
                };
                addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                address_range: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        bind_transceiver_resp: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        broadcast_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                priority_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                schedule_delivery_time: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                validity_period: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                replace_if_present_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                data_coding: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: any;
                };
                sm_default_msg_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
            };
        };
        broadcast_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
            tlvMap: {
                broadcast_area_identifier: string;
            };
        };
        cancel_broadcast_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        cancel_broadcast_sm_resp: {
            id: number;
        };
        cancel_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                dest_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                dest_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                destination_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        cancel_sm_resp: {
            id: number;
        };
        data_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                dest_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                dest_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                destination_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                esm_class: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                registered_delivery: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                data_coding: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: any;
                };
            };
        };
        data_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        deliver_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                dest_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                dest_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                destination_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                esm_class: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                protocol_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                priority_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                schedule_delivery_time: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                validity_period: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                registered_delivery: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                replace_if_present_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                data_coding: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: any;
                };
                sm_default_msg_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                short_message: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: Buffer<ArrayBuffer>;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any, skipUdh: any) => any;
                    };
                };
            };
        };
        deliver_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        enquire_link: {
            id: number;
        };
        enquire_link_resp: {
            id: number;
        };
        generic_nack: {
            id: number;
        };
        outbind: {
            id: number;
            params: {
                system_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                password: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        query_broadcast_sm: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        query_broadcast_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        query_sm: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        query_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                final_date: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                message_state: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                error_code: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
            };
        };
        replace_sm: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                schedule_delivery_time: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                validity_period: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                registered_delivery: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                sm_default_msg_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                short_message: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: Buffer<ArrayBuffer>;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any, skipUdh: any) => any;
                    };
                };
            };
        };
        replace_sm_resp: {
            id: number;
        };
        submit_multi: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                dest_address: {
                    type: {
                        read: (buffer: any, offset: any) => any[];
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => number;
                        default: any[];
                    };
                };
                esm_class: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                protocol_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                priority_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                schedule_delivery_time: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                validity_period: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                registered_delivery: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                replace_if_present_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                data_coding: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: any;
                };
                sm_default_msg_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                short_message: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: Buffer<ArrayBuffer>;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any, skipUdh: any) => any;
                    };
                };
            };
        };
        submit_multi_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                unsuccess_sme: {
                    type: {
                        read: (buffer: any, offset: any) => any[];
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => number;
                        default: any[];
                    };
                };
            };
        };
        submit_sm: {
            id: number;
            params: {
                service_type: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                source_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                source_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                dest_addr_ton: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                dest_addr_npi: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                destination_addr: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
                esm_class: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                protocol_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                priority_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                schedule_delivery_time: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                validity_period: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any) => any;
                    };
                };
                registered_delivery: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                replace_if_present_flag: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                data_coding: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                    default: any;
                };
                sm_default_msg_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: () => number;
                        default: number;
                    };
                };
                short_message: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: Buffer<ArrayBuffer>;
                    };
                    filter: {
                        encode: (value: any) => any;
                        decode: (value: any, skipUdh: any) => any;
                    };
                };
            };
        };
        submit_sm_resp: {
            id: number;
            params: {
                message_id: {
                    type: {
                        read: (buffer: any, offset: any) => any;
                        write: (value: any, buffer: any, offset: any) => void;
                        size: (value: any) => any;
                        default: string;
                    };
                };
            };
        };
        unbind: {
            id: number;
        };
        unbind_resp: {
            id: number;
        };
    };
    static readonly commandsById: {};
    static readonly types: {
        int8: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: () => number;
            default: number;
        };
        int16: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: () => number;
            default: number;
        };
        int32: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: () => number;
            default: number;
        };
        string: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: (value: any) => any;
            default: string;
        };
        cstring: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: (value: any) => any;
            default: string;
        };
        buffer: {
            read: (buffer: any, offset: any) => any;
            write: (value: any, buffer: any, offset: any) => void;
            size: (value: any) => any;
            default: Buffer<ArrayBuffer>;
        };
        dest_address_array: {
            read: (buffer: any, offset: any) => any[];
            write: (value: any, buffer: any, offset: any) => void;
            size: (value: any) => number;
            default: any[];
        };
        unsuccess_sme_array: {
            read: (buffer: any, offset: any) => any[];
            write: (value: any, buffer: any, offset: any) => void;
            size: (value: any) => number;
            default: any[];
        };
    };
    static readonly tlvs: any;
    static readonly tlvsById: {};
    static readonly errors: {
        ESME_ROK: number;
        ESME_RINVMSGLEN: number;
        ESME_RINVCMDLEN: number;
        ESME_RINVCMDID: number;
        ESME_RINVBNDSTS: number;
        ESME_RALYBND: number;
        ESME_RINVPRTFLG: number;
        ESME_RINVREGDLVFLG: number;
        ESME_RSYSERR: number;
        ESME_RINVSRCADR: number;
        ESME_RINVDSTADR: number;
        ESME_RINVMSGID: number;
        ESME_RBINDFAIL: number;
        ESME_RINVPASWD: number;
        ESME_RINVSYSID: number;
        ESME_RCANCELFAIL: number;
        ESME_RREPLACEFAIL: number;
        ESME_RMSGQFUL: number;
        ESME_RINVSERTYP: number;
        ESME_RINVNUMDESTS: number;
        ESME_RINVDLNAME: number;
        ESME_RINVDESTFLAG: number;
        ESME_RINVSUBREP: number;
        ESME_RINVESMCLASS: number;
        ESME_RCNTSUBDL: number;
        ESME_RSUBMITFAIL: number;
        ESME_RINVSRCTON: number;
        ESME_RINVSRCNPI: number;
        ESME_RINVDSTTON: number;
        ESME_RINVDSTNPI: number;
        ESME_RINVSYSTYP: number;
        ESME_RINVREPFLAG: number;
        ESME_RINVNUMMSGS: number;
        ESME_RTHROTTLED: number;
        ESME_RINVSCHED: number;
        ESME_RINVEXPIRY: number;
        ESME_RINVDFTMSGID: number;
        ESME_RX_T_APPN: number;
        ESME_RX_P_APPN: number;
        ESME_RX_R_APPN: number;
        ESME_RQUERYFAIL: number;
        ESME_RINVTLVSTREAM: number;
        ESME_RTLVNOTALLWD: number;
        ESME_RINVTLVLEN: number;
        ESME_RMISSINGTLV: number;
        ESME_RINVTLVVAL: number;
        ESME_RDELIVERYFAILURE: number;
        ESME_RUNKNOWNERR: number;
        ESME_RSERTYPUNAUTH: number;
        ESME_RPROHIBITED: number;
        ESME_RSERTYPUNAVAIL: number;
        ESME_RSERTYPDENIED: number;
        ESME_RINVDCS: number;
        ESME_RINVSRCADDRSUBUNIT: number;
        ESME_RINVDSTADDRSUBUNIT: number;
        ESME_RINVBCASTFREQINT: number;
        ESME_RINVBCASTALIAS_NAME: number;
        ESME_RINVBCASTAREAFMT: number;
        ESME_RINVNUMBCAST_AREAS: number;
        ESME_RINVBCASTCNTTYPE: number;
        ESME_RINVBCASTMSGCLASS: number;
        ESME_RBCASTFAIL: number;
        ESME_RBCASTQUERYFAIL: number;
        ESME_RBCASTCANCELFAIL: number;
        ESME_RINVBCAST_REP: number;
        ESME_RINVBCASTSRVGRP: number;
        ESME_RINVBCASTCHANIND: number;
    };
}
