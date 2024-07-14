import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { IUserNode } from '@antv/graphin';
import { HullCfg } from '@antv/graphin/lib/components/Hull';
import { Button, Input, Modal, Table, Select } from 'antd';
import { updateHulls, updateNodes } from '../../../../../redux/TopologyGroups/topologyGroupsSlice.ts';
import axios from "axios";

interface ITopologySettings {
    isModalOpen: boolean,
}

const { Option } = Select;

export function TopologySettingsTable(props: ITopologySettings) {
    const dispatch = useDispatch();
    const topologySelector = useSelector((state: RootState) => state.topologyGroups);
    const [nodes, setNodes] = useState<IUserNode[]>([]);
    const [hulls, setHulls] = useState<HullCfg[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [modalState, setModalState] = useState(false);
    const [newGroup, setNewGroup] = useState<string>('');

    const deviceTalkStatus = [
        { statusValue: 0, statusMessage: 'not in group' },
        { statusValue: 2, statusMessage: 'listens' },
        { statusValue: 1, statusMessage: 'listens and talks' },
    ];

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    useEffect(() => {
        const initialNodes = topologySelector.nodes.map(node => {
            if (!node.data.statuses[0]) {
                node.data.statuses[0] = 1;
            }
            return node;
        });
        const initialGroups = topologySelector.hullOptions.map(hull => hull.id)
            .filter((id): id is string => id !== undefined);
        if (initialGroups.length === 0) {
            initialGroups.push('Group 1');
        }
        setNodes(initialNodes);
        setHulls(topologySelector.hullOptions);
        setGroups(initialGroups);
    }, []);

    useEffect(() => {
        setNodes(topologySelector.nodes);
        setHulls(topologySelector.hullOptions);
        setGroups(topologySelector.hullOptions.map(hull => hull.id)
            .filter((id): id is string => id !== undefined));
    }, [topologySelector]);

    useEffect(() => {
        sendPttGroups(hulls, nodes);
    }, [props.isModalOpen]);

    const updateHullsOnChange = (updatedNodes: IUserNode[], updatedGroups: string[]) => {
        const newHulls: HullCfg[] = updatedGroups.map(group => {
            const members = updatedNodes
                .filter(node => {
                    const groupIndex = updatedGroups.indexOf(group);
                    return node.data.statuses[groupIndex] === 1 || node.data.statuses[groupIndex] === 2;
                })
                .map(node => node.id);
            return { id: group, members };
        });
        setHulls(newHulls);
        dispatch(updateHulls(newHulls));
    };

    const handleSelectChange = (id: string, groupIndex: number, value: string) => {
        const newNodes = nodes.map(node => {
            if (node.id === id) {
                const newStatuses = [...node.data.statuses];
                newStatuses[groupIndex] = parseInt(value);
                return { ...node, data: { ...node.data, statuses: newStatuses } };
            }
            return node;
        });
        setNodes(newNodes);
        updateHullsOnChange(newNodes, groups);
        dispatch(updateNodes(newNodes));

        // Send updated groups to the server immediately
        sendPttGroups(hulls, newNodes);
    };

    const handleDeleteGroup = (groupIndex: number) => {
        if (groups.length === 1) return;
        const newGroups = groups.filter((_, index) => index !== groupIndex);
        setGroups(newGroups);

        const newNodes = nodes.map(node => {
            const newStatuses = node.data.statuses.filter((_: string, index: number) => index !== groupIndex);
            return { ...node, data: { ...node.data, statuses: newStatuses } };
        });
        setNodes(newNodes);
        updateHullsOnChange(newNodes, newGroups);
        dispatch(updateNodes(newNodes));
    };

    const addGroup = () => {
        if (groups.length < 15 && newGroup.trim() !== '' && !groups.includes(newGroup.trim())) {
            const newGroups = [...groups, newGroup.trim()];
            setGroups(newGroups);
            const newNodes = nodes.map(node => {
                const newStatuses = [...node.data.statuses, 0];
                return { ...node, data: { ...node.data, statuses: newStatuses } };
            });
            setNodes(newNodes);
            updateHullsOnChange(newNodes, newGroups);
            dispatch(updateNodes(newNodes));
            setNewGroup('');
            closeModal();
        }
    };

    function convertPttDataToServerFormat(hulls: HullCfg[], nodes: IUserNode[]) {
        const num_groups = hulls.length;
        const ips = nodes.map(node => node.style?.label?.value) as string[];
        const statuses = nodes.map(node => node.data.statuses);
        return { ips, num_groups, statuses };
    }

    const sendPttGroups = async (hullOptions: HullCfg[], nodes: IUserNode[]) => {
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

    const columns = [
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
        },
        ...groups.map((group, groupIndex) => ({
            title: (
                <div>
                    {group}
                    {groups.length > 1 && group !== 'Group 1' && (
                        <Button onClick={() => handleDeleteGroup(groupIndex)} type="link" className="text-red-500 ml-2">Delete</Button>
                    )}
                </div>
            ),
            dataIndex: `group-${groupIndex}`,
            key: `group-${groupIndex}`,
            render: (_: any, record: any) => (
                <Select
                    value={record[`group-${groupIndex}`] || ''}
                    onChange={(value) => handleSelectChange(record.key, groupIndex, value)}
                    className="w-full"
                >
                    {deviceTalkStatus.map(status => (
                        <Option key={status.statusValue} value={status.statusValue}>
                            {status.statusMessage}
                        </Option>
                    ))}
                </Select>
            ),
        })),
    ];

    const dataSource = nodes.map(node => ({
        key: node.id,
        label: node.style?.label?.value,
        ...groups.reduce((acc, _, groupIndex) => ({
            ...acc,
            [`group-${groupIndex}`]: node.data.statuses[groupIndex] || '',
        }), {}),
    }));

    return (
        <div className="p-4">
            <Button onClick={openModal}>Add Group</Button>
            <Modal title={'Add New Group'} open={modalState} onOk={addGroup} onCancel={closeModal}>
                <Input value={newGroup} placeholder="Enter group name" onChange={(e) => setNewGroup(e.target.value)} />
            </Modal>
            <Table columns={columns} dataSource={dataSource} bordered />
        </div>
    );
}
