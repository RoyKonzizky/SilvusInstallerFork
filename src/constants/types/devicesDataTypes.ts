export type devicesType = { ip: string, id: string, name: string, is_online: boolean, status: number[], percent: string }[];
export type batteriesType = { ip: string, percent: string }[];
export type snrsType = { id1: string, id2: string, snr: string }[];
export type Camera = {
    ip: string;
    device_id: string;
    device_ip: string;
    main_stream: {
        uri: string;
        audio: number;
    };
    sub_stream: {
        uri: string;
        audio: number;
    };
};
export type camsType = { message: string, data: Camera[]; };