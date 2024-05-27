import {IUserNode} from "@antv/graphin";
import {RestNode} from "@antv/graphin/es/typings/type";
import Select from "react-select";

export type selectedOptionsType = { [p: string]: { [p: string]: number } };
export type handleSelectChangeType = (group: string, nodeId: string, value: number | null) => void;

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

export const deviceTalkStatus = [
    {value: 0, label: "לא בקבוצה"},
    {value: 1, label: "מקשיב"},
    {value: 2, label: "מדבר ומקשיב"},
];

export function updateHullOptions(groups: string[], nodes: IUserNode[], selectedOptions: selectedOptionsType) {
    return groups.map(group => {
        return {
            id: group,
            members: nodes.filter(node => selectedOptions[group]?.[node.id] > 0)
                .map(node => node.id)
        };
    });
}

export function convertDataToServerFormat(hulls: { id: string, members: string[] }[], nodes: IUserNode[] | RestNode[]) {
    const numOfGroups = hulls.length;
    const ips = hulls.map(hull => hull.members);
    const statuses: number[][] = (nodes as RestNode[]).map(node => (node as RestNode).data.statuses);
    const convertedData = {num_groups: numOfGroups, ips, statuses};
    return JSON.stringify(convertedData);
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
                           handleSelectChange: (group: string, nodeId: string, value: number | null) => void) {
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