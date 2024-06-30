import binIcon from "../../assets/bin.png";
import axios from "axios";
import { Button } from "antd";
import {IUserNode} from "@antv/graphin";
import Select from "react-select";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {Dispatch, SetStateAction} from "react";

export type selectedOptionsType = { [p: string]: { [p: string]: number } };
export type handleSelectChangeType = (group: string, nodeId: string, value: number | null) => void;

export const deviceTalkStatus = [
    {value: 0, label: "לא בקבוצה"},
    {value: 2, label: "מקשיב"},
    {value: 1, label: "מדבר ומקשיב"},
];

export function createDataSource(nodes: IUserNode[]) {
    return nodes.map((node: IUserNode, index: number) => ({key: index, ...node}))
}

export function convertSelectedOptionsToHulls(
    groups: string[], nodes: IUserNode[], selectedOptions: selectedOptionsType) {
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

/*
export function convertHullsToSelectedOptions(hullOptions: HullCfg[], nodes: IUserNode[]) {
    const selectedOptions: { [group: string]: { [nodeId: string]: number } } = {};

    hullOptions.forEach(hull => {
        const group = hull.id || '';
        selectedOptions[group] = {};

        hull.members.forEach(memberId => {
            const node = nodes.find(node => node.id === memberId);
            if (node && node.data && node.data.statuses) {
                const groupIndex = hullOptions.findIndex(h => h.id === group);
                selectedOptions[group][memberId] = node.data.statuses[groupIndex] || 0;
            }
        });
    });

    return selectedOptions;
}
 */

export function isIUserNode(node: IUserNode): node is IUserNode {
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
                           handleSelectChange: handleSelectChangeType, handleDeleteGroup: (group: string) => void) {
    return [
        {
            title: 'Node Label', dataIndex: 'label', key: 'label',
            render: (_: string, record: any) => <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {group}
                    <Button type="link" onClick={() => handleDeleteGroup(group)}>
                        <img className={"w-6 h-6"} src={binIcon} alt={"Delete"}/>
                    </Button>
                </div>
            ),
            dataIndex: group,
            key: group,
            render: (_: string, record: any) => renderSelect(record, group, selectedOptions, handleSelectChange),
        })),
    ];
}

export function convertPttDataToServerFormat(hulls: HullCfg[], nodes: IUserNode[]) {
    const num_groups = hulls.length;
    const ips = nodes.map(node => node.style?.label?.value) as string[];
    const statuses = nodes.map(node => node.data.statuses);
    // console.log(statuses);
    return {ips, num_groups, statuses};
}

export const sendPttGroups = async (hullOptions: HullCfg[], nodes: IUserNode[]) => {
    // console.log(convertPttDataToServerFormat(hullOptions, nodes));
    try {
        const response = await axios.post(
            'http://localhost:8080/set-ptt-groups', convertPttDataToServerFormat(hullOptions, nodes),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Response received:', response.data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};

export const handleAddGroup = (groupName: string,
                               groups: string[], setGroups: Dispatch<SetStateAction<string[]>>) => {
    if (groups.length < 15) {
        setGroups((prevGroups) => [...prevGroups, groupName]);
    }
};

export const handleDeleteGroup = (groupName: string, groups: string[], setGroups: Dispatch<SetStateAction<string[]>>,
    setSelectedOptions: Dispatch<SetStateAction<{ [group: string]: { [nodeId: string]: number } }>>) => {
    if (groups.length > 1) {
        setGroups((prevGroups) => prevGroups.filter((group) => group !== groupName));
        setSelectedOptions((prevOptions) => {
            const { [groupName]: _, ...rest } = prevOptions;
            return rest;
        });
    }
};

export const handleSelectChange = (group: string, nodeId: string, value: number | null, groups: string[],
     setSelectedOptions: Dispatch<SetStateAction<{ [group: string]: { [nodeId: string]: number } }>>,
     setNodes: Dispatch<SetStateAction<IUserNode[]>>,
                                   selectedOptions: { [group: string]: { [nodeId: string]: number } }) => {
    const newValue = value ?? 0;
    setSelectedOptions((prevOptions) =>
        ({ ...prevOptions, [group]: { ...prevOptions[group], [nodeId]: newValue } }));
    setNodes((prevNodes) => prevNodes.map((node) => {
        if (isIUserNode(node) && node.id === nodeId) {
            const updatedStatuses = groups.map((grp) => selectedOptions[grp]?.[node.id] ?? 0);
            updatedStatuses[groups.indexOf(group)] = newValue;
            return { ...node, data: { ...node.data, statuses: updatedStatuses } };
        }
        return node;
    }));
};
