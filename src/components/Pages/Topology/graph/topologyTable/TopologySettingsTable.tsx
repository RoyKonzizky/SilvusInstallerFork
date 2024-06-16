import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Table} from "antd";
import {IUserNode} from "@antv/graphin";
import {updateHulls} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {convertHullsToSelectedOptions, convertSelectedOptionsToHulls, createDataSource, deviceTalkStatus
} from "../../../../../utils/topologyUtils/settingsTableUtils.ts";
import Select from 'react-select';
import {RootState} from "../../../../../redux/store.ts";

interface ITopologySettingsTable {
    groups: string[],
    nodes: IUserNode[]
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullOptions = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const initialSelectedOptions = convertHullsToSelectedOptions(hullOptions, props.nodes);
    const initialGroups = props.groups.length ? props.groups : Object.keys(initialSelectedOptions);
    const [selectedOptions, setSelectedOptions] =
        useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [groups, setGroups] = useState<string[]>(initialGroups);
    const [additionalColumn, setAdditionalColumn] =
        useState<string | null>(null);

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
        const updatedHulls = convertSelectedOptionsToHulls(groups, props.nodes,
            selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, props.nodes, dispatch]);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(props.nodes)}/>
        </div>
    );
}
