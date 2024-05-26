import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Button, Table } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {createDataSource, deviceTalkStatus, isIUserNode, updateHullOptions
} from "../../../../../utils/topologyUtils/settingsTableUtils.ts";
import Select from 'react-select';
import { RestNode } from "@antv/graphin/es/typings/type";

interface ITopologySettingsTable {
    groups: string[],
    nodes: (IUserNode | RestNode)[]
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const [additionalColumn, setAdditionalColumn] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{ [group: string]: { [nodeId: string]: number } }>({});
    const [groups, setGroups] = useState<string[]>(props.groups);
    const [nodes, setNodes] = useState<(IUserNode | RestNode)[]>(props.nodes);
    const dispatch = useDispatch();

    function handleAddColumn() {
        const newColumn = window.prompt("Enter the name of the new column:");
        if (newColumn) setAdditionalColumn(newColumn);
    }

    function handleSelectChange(group: string, nodeId: string, value: number | null) {
        const newValue = value ?? 0;
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [group]: {
                ...prevOptions[group],
                [nodeId]: newValue
            }
        }));

        setNodes(prevNodes =>
            prevNodes.map(node => {
                if (isIUserNode(node) && node.id === nodeId) {
                    return { ...node, data: { ...node.data, [group]: newValue } };
                }
                return node;
            })
        );
    }

    function renderSelect(record: any, group: string) {
        if (!isIUserNode(record)) {
            return null;
        }
        const nodeId = record.id;
        const value = selectedOptions[group]?.[nodeId] ?? 0;
        return (
            <Select
                options={deviceTalkStatus}
                placeholder={"סטטוס דיבור"}
                isClearable
                value={deviceTalkStatus.find(option => option.value === value) || null}
                onChange={(option) => handleSelectChange(group, nodeId, option ? option.value : null)}
            />
        );
    }

    const columns = [
        {
            title: 'Node Label',
            dataIndex: 'label',
            key: 'label',
            render: (_: string, record: any) => <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: group,
            dataIndex: group,
            key: group,
            render: (_: string, record: any) => renderSelect(record, group),
        })),
    ];

    useEffect(() => {
        if (additionalColumn) setGroups([...groups, additionalColumn]);
    }, [additionalColumn]);

    useEffect(() => {
        const updatedHulls = updateHullOptions(groups, nodes as IUserNode[], selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, dispatch, nodes]);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(nodes as IUserNode[])} />
        </div>
    );
}
