import {IUserNode} from "@antv/graphin";
import {HullCfg} from "@antv/graphin/lib/components/Hull";

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

export const deviceTalkStatus = [
    { value: 0, label: "לא בקבוצה" },
    { value: 1, label: "מקשיב" },
    { value: 2, label: "מדבר ומקשיב" },
];

export function convertSelectedOptionsToHulls(groups: string[], nodes: IUserNode[], selectedOptions: {[p: string]: {[p: string]: number}}) {
    return groups.map(group => {
        return {
            id: group,
            members: nodes.filter(node => selectedOptions[group]?.[node.id] > 0)
                .map(node => node.id)
        };
    });
}

export function convertHullsToSelectedOptions(hullOptions: HullCfg[], nodes: IUserNode[]) {
    const selectedOptions: { [group: string]: { [nodeId: string]: number } } = {};

    hullOptions.forEach(hull => {
        const group = hull.id || '';
        selectedOptions[group] = {};

        hull.members.forEach(memberId => {
            if (nodes.some(node => node.id === memberId)) {
                selectedOptions[group][memberId] = 1;
            }
        });
    });

    return selectedOptions;
}