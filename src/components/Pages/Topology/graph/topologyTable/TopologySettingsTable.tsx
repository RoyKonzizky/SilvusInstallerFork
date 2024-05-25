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
    const [additionalColumn, setAdditionalColumn] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: { [group: string]: any } }>({});
    const [groups, setGroups] = useState(props.groups);
    const dispatch = useDispatch();

    const handleAddColumn = () => {
        const newColumn = window.prompt("Enter the name of the new column:");
        if (newColumn) setAdditionalColumn(newColumn);
    };

    const handleSelectChange = (recordKey: string, group: string, selectedOption: any) => {
        setSelectedOptions(prevState => ({
            ...prevState, [recordKey]: {...prevState[recordKey], [group]: selectedOption},
        }));
    };

    const renderSelect = (record: any, group: string) => {
        const selectedOption = selectedOptions[record.key]?.[group] || null;
        return (
            <Select options={deviceTalkStatus} value={selectedOption} placeholder={"סטטוס דיבור"}
                onChange={(option) => handleSelectChange(record.key, group, option)} isClearable={true}/>
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
        const newHullOptions = groups.map(group => ({
            id: group,
            members: props.nodes
                .filter(node => selectedOptions[node.key]?.[group]?.value === group)
                .map(node => node.id)
        }));
        console.log(selectedOptions);
        dispatch(updateHulls(newHullOptions));
    }, [groups, selectedOptions]);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(props.nodes)}/>
        </div>
    );
}
