import {IUserNode} from "@antv/graphin";
import {RestNode} from "@antv/graphin/es/typings/type";
import Select from "react-select";
import {HullCfg} from "@antv/graphin/lib/components/Hull";

export type selectedOptionsType = { [p: string]: { [p: string]: number } };
export type handleSelectChangeType = (group: string, nodeId: string, value: number | null) => void;

export const deviceTalkStatus = [
    {value: 0, label: "לא בקבוצה"},
    {value: 1, label: "מקשיב"},
    {value: 2, label: "מדבר ומקשיב"},
];

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

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

export function isIUserNode(node: IUserNode | RestNode): node is IUserNode {
    return (node as IUserNode).id !== undefined;
}

export function renderSelect(record: any, group: string, selectedOptions: selectedOptionsType,
                             handleSelectChange: handleSelectChangeType) {
    if (!isIUserNode(record)) return null;
    const nodeId = record.id;
    const value = selectedOptions[group]?.[nodeId] ?? 0;
    return (
        <Select options={deviceTalkStatus} placeholder={"סטטוס דיבור"} isClearable
                value={deviceTalkStatus.find(option => option.value === value) || null}
                onChange={(option) =>
                    handleSelectChange(group, nodeId, option ? option.value : null)}
        />
    );
}

export function getColumns(groups: string[], selectedOptions: selectedOptionsType,
                           handleSelectChange: handleSelectChangeType) {
    return [
        {
            title: 'Node Label', dataIndex: 'label', key: 'label',
            render: (_: string, record: any) => <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: group, dataIndex: group, key: group,
            render: (_: string, record: any) => renderSelect(record, group, selectedOptions, handleSelectChange),
        })),
    ];
}
