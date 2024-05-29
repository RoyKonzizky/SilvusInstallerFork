import {IUserNode} from "@antv/graphin";

export type devicesType = { radio_ip: string, node_ids: string[], node_ips: string[] };
export type batteriesType = {ip: string, percent: string}[];
export type snrElementType = [[string, string], string];
export type snrsType = snrElementType[];

export function convertDataToServerFormat(hulls: { id: string, members: string[] }[], nodes: IUserNode[]) {
    const numOfGroups = hulls.length;
    const ips = hulls.map(hull => hull.members);
    const statuses: number[][] = nodes.map(node => node.data.statuses);
    const convertedData = {num_groups: numOfGroups, ips, statuses};
    return JSON.stringify(convertedData);
}
