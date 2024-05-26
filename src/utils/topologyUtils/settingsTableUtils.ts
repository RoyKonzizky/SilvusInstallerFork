import {IUserNode} from "@antv/graphin";
import {RestNode} from "@antv/graphin/es/typings/type";

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

export const deviceTalkStatus = [
    { value: 0, label: "לא בקבוצה" },
    { value: 1, label: "מקשיב" },
    { value: 2, label: "מדבר ומקשיב" },
];

export function updateHullOptions(groups: string[], nodes: IUserNode[], selectedOptions: {[p: string]: {[p: string]: number}}) {
    return groups.map(group => {
        return {
            id: group,
            members: nodes.filter(node => selectedOptions[group]?.[node.id] > 0)
                .map(node => node.id)
        };
    });
}
export function convertDataToServerFormat(hulls: {id: string, members: string[]}[], nodes: IUserNode[] | RestNode[]) {
    const numOfGroups = hulls.length;
    const ips = hulls.map(hull => hull.members);
    const statuses: number[][] = (nodes as RestNode[]).map(node => (node as RestNode).data.statuses);
    const convertedData = {num_groups: numOfGroups, ips, statuses};
    return JSON.stringify(convertedData);
}

export function isIUserNode(node: IUserNode | RestNode): node is IUserNode {
    return (node as IUserNode).id !== undefined;
}
