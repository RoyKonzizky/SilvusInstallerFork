// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import binIcon from "../../assets/bin.png";
import { Button, Popover, Select } from "antd";
import { IUserNode } from "@antv/graphin";
import { HullCfg } from "@antv/graphin/lib/components/Hull";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { t } from "i18next";
import { toast } from "react-toastify";
import { updateSingleDeviceBattery } from "../../redux/TopologyGroups/topologyGroupsSlice";
import refreshIcon from "../../assets/refresh.svg";
import cameraIcon from "../../assets/video-camera.svg";
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

export function createColumns(groups: string[], nodes: IUserNode[], hulls: HullCfg[], camerasMap: any, dispatch: any,
    updateNodes: ActionCreatorWithPayload<IUserNode[], "topologyGroups/updateNodes">,
    updateHulls: ActionCreatorWithPayload<HullCfg[], "topologyGroups/updateHulls">,
    handleStatusChange: (nodeId: string, groupIndex: number, status: number) => void,
    updateBatteryInfo: (deviceId: string, dispatch: any) => void) {
    const columns = [
        { title: t('deviceLabelHeader'), dataIndex: 'label', key: 'label' },
        {
            title: t('batteryHeader'),
            dataIndex: 'battery',
            key: 'battery',
            render: (status: number, record: any) => (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '2rem' }}>{status >= 0 ? status : ''}</div>
                    <button onClick={() => updateBatteryInfo(record.key, dispatch)} style={{ width: '4rem' }}>
                        <img
                            src={refreshIcon}
                            style={{ width: '1.2rem' }}
                            className={status === -1 ? 'rotate-animation' : ''}
                        />
                    </button>
                </div>
            )
        },
        {
            title: t('CameraHeader'),
            dataIndex: 'camera',
            key: 'camera',
            render: (_: number, record: any) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {camerasMap[record.key] &&
                        <Popover
                            trigger="click"
                            placement="bottom"
                            content={
                                <div style={{ direction: i18n.language === 'en' ? "ltr" : "rtl" }}>
                                    <div style={{ fontWeight: 'bold' }}>{t('CameraPopoverHeader')}</div>
                                    <div>{`${t('CameraIpLabel')}: ${camerasMap[record.key].ip}`}</div>
                                    <div>{`${t('DeviceIpLabel')}: ${camerasMap[record.key].device_ip}`}</div>
                                </div>
                            }
                        >
                            <img src={cameraIcon} style={{ width: '1.8rem' }} alt={'camera icon'}/>
                        </Popover >
                    }
                </div >
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
            dataIndex: group, key: group,
            render: (status: number, record: any) => (
                <Select
                    value={status}
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

export function checkIfUnassignedToGroup(nodes: IUserNode[]): IUserNode[] {
    return nodes.map(node => {
        const newStatuses = [...node.data.statuses];

        if (!newStatuses.includes(1)) {
            newStatuses[0] = 1;
        }

        return {
            ...node,
            data: {
                ...node.data,
                statuses: newStatuses,
            },
        };
    });
}

export function convertNodesToHulls(nodes: IUserNode[], hulls: HullCfg[]): HullCfg[] {
    const longestStatusesLength = findLongestStatusesLength(nodes);
    const newHulls: HullCfg[] = [];

    for (let i = 0; i < longestStatusesLength; i++) {
        if (hulls[i]) {
            newHulls[i] = { id: hulls[i].id, members: [...hulls[i].members] };
        } else {
            newHulls[i] = { id: `hull${i}`, members: [] };
        }
    }

    nodes.forEach(node => {
        node.data.statuses.forEach((statusPtt: number, index: number) => {
            if (statusPtt > 0 && newHulls[index]) {
                newHulls[index].members.push(node.id);
            }
        });
    });

    return newHulls;
}


export function findLongestStatusesLength(nodes: IUserNode[]): number {
    let maxLength = 0;

    nodes.forEach(node => {
        if (node.data.statuses.length > maxLength) {
            maxLength = node.data.statuses.length;
        }
    });

    return maxLength;
}

export function convertPttDataToServerFormat(hulls: HullCfg[], nodes: IUserNode[]) {
    const num_groups = hulls.length;
    const ips = nodes.map(node => node.data.ip) as string[];
    const statuses = nodes.map(node => node.data.statuses);
    // console.log(statuses);
    return { ips, num_groups, statuses };
}

export const sendPttGroups = async (hullOptions: HullCfg[], nodes: IUserNode[]) => {
    try {
        await axios.post(
            'http://localhost:8080/set-ptt-groups', convertPttDataToServerFormat(hullOptions, nodes),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        // console.log('Response received:', response.data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};

export const updateBatteryInfo = async (deviceId: string, dispatch: any) => {
    try {
        const updatedBatteryInfo = await axios.get(`http://localhost:8080/device-battery?device_id=${deviceId}`);
        if (updatedBatteryInfo?.data?.percent ?? false) {
            if (updatedBatteryInfo?.data?.percent == -2) {
                toast.error(t("batteryInfoFailureMsg"));
                return;
            }

            dispatch(updateSingleDeviceBattery({
                id: deviceId,
                battery: updatedBatteryInfo.data.percent
            }));
        }
    } catch (e) {
        toast.error(t("batteryInfoFailureMsg"));
    }
}

export const getDataInterval = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/data-interval`);
        return response?.data?.value;
    } catch (e) {
        return null;
    }
}

export const updateDataInterval = async (value: number) => {
    try {
        const response = await axios.post(`http://localhost:8080/data-interval`, { value });

        if (response?.status === 200) {
            return response.data;
        }
        return null;
    } catch (e) {
        return null
    }
}

export function padStatuses(nodes: IUserNode[]): IUserNode[] {
    const maxLength = Math.max(...nodes.map(node => node.data.statuses.length));

    return nodes.map(node => {
        const paddedStatuses = [...node.data.statuses];
        while (paddedStatuses.length < maxLength) {
            paddedStatuses.push(0);
        }
        return {
            ...node,
            data: {
                ...node.data,
                statuses: paddedStatuses,
            },
        };
    });
}
