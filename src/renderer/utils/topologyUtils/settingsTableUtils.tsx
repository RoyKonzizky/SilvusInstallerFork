import { Select } from "antd";
import { IUserNode } from "@antv/graphin";
import { HullCfg } from "@antv/graphin/lib/components/Hull";
import axios from "axios";
import {Dispatch, SetStateAction} from "react";

const { Option } = Select;

export const deviceTalkStatus = [
    { value: 0, label: "לא בקבוצה" },
    { value: 2, label: "מקשיב" },
    { value: 1, label: "מדבר ומקשיב" },
];

export function createDataSource(nodes: IUserNode[], groups: string[]) {
    return nodes.map((node: IUserNode) => {
        const groupStatuses = groups.reduce((acc, group, groupIndex) => {
            acc[group] = node.data.statuses[groupIndex];
            return acc;
        }, {} as Record<string, number>);
        return {
            key: node.id,
            label: node.style?.label?.value,
            ...groupStatuses,
        };
    });
}

export function createColumns(groups: string[],
                              handleStatusChange: (nodeId: string, groupIndex: number, status: number) => void) {
    const columns = [
        { title: 'Node Label', dataIndex: 'label', key: 'label' },
        ...groups.map((group, groupIndex) => ({
            title: group, dataIndex: group, key: group,
            render: (status: number, record: any) => (
                <Select value={status}
                        onChange={(value: number) => handleStatusChange(record.key, groupIndex, value)}
                        style={{ width: '100%' }}
                >
                    {deviceTalkStatus.map(statusOption => (
                        <Option key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                        </Option>
                    ))}
                </Select>
            )
        })),
    ];

    return columns;
}

export function createGroups(hulls: HullCfg[]) {
    const initialGroups = hulls.length > 0 ? hulls.map(hull => hull.id) : [];
    const filteredGroups = initialGroups.filter(group => typeof group === 'string') as string[];
    return filteredGroups;
}

export function handleStatusChange(nodes: IUserNode[], nodeId: string, groupIndex: number, status: number,
                                   dispatch: any, updateNodes: any) {
    const updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
            const updatedStatuses = [...node.data.statuses];
            updatedStatuses[groupIndex] = status;
            return { ...node, data: { ...node.data, statuses: updatedStatuses } };
        }
        return node;
    });
    dispatch(updateNodes(updatedNodes));
    return updatedNodes;
}

export function handleAddGroup(newGroup: string, groups: string[], setGroups: Dispatch<SetStateAction<string[]>>,
                               nodes: IUserNode[], setNodes: Dispatch<SetStateAction<IUserNode[]>>,
                               hulls: HullCfg[], setHulls: Dispatch<SetStateAction<HullCfg[]>>,
                               dispatch: any, updateNodes: any, updateHulls: any) {
    if (groups.length < 15) {
        const newGroups = [...groups, newGroup];
        setGroups(newGroups);

        const updatedNodes = nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                statuses: [...node.data.statuses, 0]
            }
        }));
        setNodes(updatedNodes);
        dispatch(updateNodes(updatedNodes));

        const newHull = { id: newGroup, members: [] };
        const updatedHulls = [...hulls, newHull];
        setHulls(updatedHulls);
        dispatch(updateHulls(updatedHulls));
    }
}

export function convertNodesToHulls(nodes: IUserNode[], hulls: HullCfg[]): HullCfg[] {
    const updatedHulls = hulls.map(hull => ({
        ...hull,
        members: new Set<string>()
    }));

    nodes.forEach(node => {
        const statuses = node.data.statuses;

        statuses.forEach((status: number, index: number) => {
            if (status > 0) {
                updatedHulls[index].members.add(node.id);
            }
        });
    });

    return updatedHulls.map(hull => ({
        ...hull,
        members: Array.from(hull.members)
    }));
}


export function convertPttDataToServerFormat(hulls: HullCfg[], nodes: IUserNode[]) {
    const num_groups = hulls.length;
    const ips = nodes.map(node => node.data.ip) as string[];
    const statuses = nodes.map(node => node.data.statuses);
    console.log(statuses);
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

