import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Button, Table} from "antd";
import {IUserNode} from "@antv/graphin";
import {updateHulls} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {createDataSource, deviceTalkStatus, updateHullOptions
} from "../../../../../utils/topologyUtils/settingsTableUtils.ts";
import Select from 'react-select';

interface ITopologySettingsTable {
    groups: string[],
    nodes: IUserNode[]
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const [additionalColumn, setAdditionalColumn] =
        useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] =
        useState<{ [group: string]: { [nodeId: string]: number } }>({});
    const [groups, setGroups] = useState(props.groups);
    const dispatch = useDispatch();

    function handleAddColumn() {
        const newColumn = window.prompt("Enter the name of the new column:");
        if (newColumn) setAdditionalColumn(newColumn);
    }

    function handleSelectChange(group: string, nodeId: string, value: number | null) {
        setSelectedOptions(prevOptions => ({
            ...prevOptions, [group]: {...prevOptions[group], [nodeId]: value ?? 0}
        }));
    }

    function renderSelect(record: any, group: string) {
        const nodeId = record.id;
        const value = selectedOptions[group]?.[nodeId] ?? 0;
        return (
            <Select options={deviceTalkStatus} placeholder={"סטטוס דיבור"} isClearable
                    value={deviceTalkStatus.find(option => option.value === value) || null}
                    onChange={(option) =>
                        handleSelectChange(group, nodeId, option ? option.value : 0)}/>
        );
    }

    const columns = [
        {
            title: 'Node Label', dataIndex: 'label', key: 'label',
            render: (_: string, record: any) => <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: group, dataIndex: group, key: group,
            render: (_: string, record: any) => renderSelect(record, group),
        })),
    ];

    useEffect(() => {
        if (additionalColumn) setGroups([...groups, additionalColumn]);
    }, [additionalColumn]);

    useEffect(() => {
        const updatedHulls = updateHullOptions(groups, props.nodes, selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, dispatch]);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(props.nodes)}/>
        </div>
    );
}
