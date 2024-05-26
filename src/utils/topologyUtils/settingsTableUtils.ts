import {IUserNode} from "@antv/graphin";

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
