export type devicesType = { ip: string, id: string, name: string }[];
export type batteriesType = { ip: string, percent: string }[];
export type snrsType = { id1: string, id2: string, snr: string }[];
export type camsType = {
    message: string;
    data: {
        camera: {
            ip: string;
            connected_to: string;
            main_stream: {
                uri: string;
                audio: number;
            };
            sub_stream: {
                uri: string;
                audio: number;
            };
        };
    }[];
};