import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {Button, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {IUserNode} from "@antv/graphin";
import {updateHulls} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {createDataSource, deviceTalkStatus} from "../../../../../utils/topologyUtils/settingsTableUtils.ts";
import Select from 'react-select';

interface ITopologySettingsTable {
    groups: string[],
    nodes: IUserNode[]
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const [additionalColumn, setAdditionalColumn] = useState<string | null>(null);
    const [groups, setGroups] = useState(props.groups);
    const [selectedOptions, setSelectedOptions] = useState<{ [group: string]: { [nodeId: string]: number } }>({});

    const handleAddColumn = () => {
        const newColumn = window.prompt("Enter the name of the new column:");
        if (newColumn) setAdditionalColumn(newColumn);
    };

    const handleSelectChange = (group: string, nodeId: string, value: number | null) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [group]: {
                ...prevOptions[group],
                [nodeId]: value ?? 0
            }
        }));
    };

    const renderSelect = (record: any, group: string) => {
        const nodeId = record.id;
        const value = selectedOptions[group]?.[nodeId] ?? 0;
        return (
            <Select options={deviceTalkStatus} placeholder={"סטטוס דיבור"} isClearable
                    value={deviceTalkStatus.find(option => option.value === value)}
                    onChange={(option) =>
                        handleSelectChange(group, nodeId, option?.value ?? 0)}
            />
        );
    };

    const columns = [
        {
            title: 'Node Label', dataIndex: 'label', key: 'label',
            render: (_: string, record: any) => <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: group, dataIndex: group, key: group,
            render: (_: string, record: any) => renderSelect(record, group),
        })),
    ] as ColumnsType;

    useEffect(() => {
        if (additionalColumn) setGroups([...groups, additionalColumn]);
    }, [additionalColumn]);

    useEffect(() => {
        const updatedHulls = groups.map(group => {
            const members = props.nodes.filter(node => selectedOptions[group]?.[node.id] > 0);
            return {id: group, members: members.map(node => node.id)};
        });
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, props.nodes, dispatch]);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(props.nodes)}/>
        </div>
    );
}