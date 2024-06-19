import {IUserNode} from "@antv/graphin";

// export type devicesType = { radio_ip: string, node_ids: string[], node_ips: string[] };
export type devicesType = {ip: string, id: string}[];
export type batteriesType = {ip: string, percent: string}[];
export type snrsType = {id1: string, id2: string, snr: string}[];

export function convertDataToServerFormat(hulls: { id: string, members: string[] }[], nodes: IUserNode[]) {
    const numOfGroups = hulls.length;
    const ips = hulls.map(hull => hull.members);
    const statuses: number[][] = nodes.map(node => node.data.statuses);
    const convertedData = {num_groups: numOfGroups, ips, statuses};
    return JSON.stringify(convertedData);
}
