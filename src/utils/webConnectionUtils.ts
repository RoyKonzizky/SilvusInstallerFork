import {IUserNode} from "@antv/graphin";

export function convertDataToServerFormat(hulls: { id: string, members: string[] }[], nodes: IUserNode[]) {
    const numOfGroups = hulls.length;
    const ips = hulls.map(hull => hull.members);
    const statuses: number[][] = nodes.map(node => node.data.statuses);
    const convertedData = {num_groups: numOfGroups, ips, statuses};
    return JSON.stringify(convertedData);
}
