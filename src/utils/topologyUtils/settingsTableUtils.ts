import {IUserNode} from "@antv/graphin";

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

export const deviceTalkStatus = [
    { value: 0, label: "לא בקבוצה" },
    { value: 1, label: "מקשיב" },
    { value: 2, label: "מדבר ומקשיב" },
];
