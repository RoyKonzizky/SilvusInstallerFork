// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import binIcon from "../../assets/bin.png";
import { Button, Select } from "antd";
import { IUserNode } from "@antv/graphin";
import { HullCfg } from "@antv/graphin/lib/components/Hull";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import refreshIcon from "../../assets/refresh.svg";
import { t } from "i18next";
import i18n from "../../i18n";

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
            battery: node.data?.battery,
            ...groupStatuses,
        };
    });
}

export function createGroups(hulls: HullCfg[]) {
    const initialGroups = hulls.length > 0 ? hulls.map(hull => hull.id) : [];
    const filteredGroups = initialGroups.filter(group => typeof group === 'string') as string[];
    return filteredGroups;
}

export function createColumns(
    groups: string[],
    nodes: IUserNode[],
    hulls: HullCfg[],
    dispatch: any,
    updateNodes: ActionCreatorWithPayload<IUserNode[], "topologyGroups/updateNodes">,
    updateHulls: ActionCreatorWithPayload<HullCfg[], "topologyGroups/updateHulls">,
    handleStatusChange: (nodeId: string, groupIndex: number, status: number) => void,
    updateBatteryInfo: (deviceId: string) => void
) {
    const columns = [
        { title: t('deviceLabelHeader'), dataIndex: 'label', key: 'label' },
        {
            title: t('batteryHeader'),
            dataIndex: 'battery',
            key: 'battery',
            render: (status: number, record: any) => (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '1rem' }}>{status >= 0 ? status : ''}</div>
                    <button onClick={() => updateBatteryInfo(record.key)} style={{ width: '4rem' }}>
                        <img
                            src={refreshIcon}
                            style={{ width: '1.2rem' }}
                            className={status === -1 ? 'rotate-animation' : ''}
                        />
                    </button>
                </div>
            )
        },
        ...groups.map((group, groupIndex) => ({
            title: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {group}
                    <Button type="link" onClick={() =>
                        handleDeleteGroup(group, groups, nodes, hulls, dispatch, updateNodes, updateHulls)}>
                        <img className={"w-6 h-6"} src={binIcon} alt={"Delete"} />
                    </Button>
                </div>
            ),
            dataIndex: group,
            key: group,
            render: (status: number, record: any) => (
                <Select
                    value={status}
                    onChange={(value: number) => handleStatusChange(record.key, groupIndex, value)}
                    style={{ width: '100%' }}
                    direction={i18n.language === 'en' ? 'ltr' : 'rtl'}
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

export function handleStatusChange(nodes: IUserNode[], nodeId: string, groupIndex: number, status: number,
    dispatch: any,
    updateNodes: ActionCreatorWithPayload<IUserNode[], "topologyGroups/updateNodes">) {
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
    dispatch: any,
    updateNodes: ActionCreatorWithPayload<IUserNode[], "topologyGroups/updateNodes">,
    updateHulls: ActionCreatorWithPayload<HullCfg[], "topologyGroups/updateHulls">) {
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

export function handleDeleteGroup(groupToDelete: string, groups: string[], nodes: IUserNode[], hulls: HullCfg[],
    dispatch: any,
    updateNodes: ActionCreatorWithPayload<IUserNode[], "topologyGroups/updateNodes">,
    updateHulls: ActionCreatorWithPayload<HullCfg[], "topologyGroups/updateHulls">) {
    if (groups.length > 1) {
        const groupIndex = groups.indexOf(groupToDelete);
        if (groupIndex === -1) {
            return;
        }

        const updatedGroups = groups.filter(group => group !== groupToDelete);

        const updatedNodes = nodes.map(node => {
            const updatedStatuses = node.data.statuses.filter((_: number, index: number) => index !== groupIndex);
            return {
                ...node,
                data: {
                    ...node.data,
                    statuses: updatedStatuses
                }
            };
        });
        dispatch(updateNodes(updatedNodes));

        const updatedHulls = hulls.filter(hull => hull.id !== groupToDelete);
        dispatch(updateHulls(updatedHulls));

        return updatedGroups;
    }

}

export function checkIfUnassignedToGroup(nodes: IUserNode[], groups: string[]) {
    const groupCount = groups.length;

    return nodes.map(node => {
        const statuses = node.data.statuses;
        const isAssigned = statuses.includes(1);

        const updatedStatuses = Array.from({ length: groupCount }, (_, index) =>
            statuses[index] || 0);

        if (!isAssigned && groupCount > 0) {
            updatedStatuses[0] = 1;
        }

        return {
            ...node,
            data: {
                ...node.data,
                statuses: updatedStatuses
            }
        };
    });
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
    const names = nodes.map(node => node.style?.label?.value) as string[];
    const statuses = nodes.map(node => node.data.statuses);
    console.log(statuses);
    return { ips, num_groups, statuses };
}

export const sendPttGroups = async (hullOptions: HullCfg[], nodes: IUserNode[]) => {
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