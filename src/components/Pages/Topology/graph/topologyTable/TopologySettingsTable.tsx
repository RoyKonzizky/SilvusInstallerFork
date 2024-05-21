import {useEffect, useState} from 'react';
import {Button, Table} from "antd";
import {ColumnsType} from "antd/lib/table";
import {IUserNode} from "@antv/graphin";

interface ITopologySettingsTable {
    groups: string[],
    nodes: IUserNode[]
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const [additionalColumn, setAdditionalColumn] =
        useState<string | null>(null);
    const [selectedCheckboxes, setSelectedCheckboxes] =
        useState<{ [key: string]: string | null }>({});
    const [groups, setGroups] = useState(props.groups);

    const handleAddColumn = () => {
        const newColumn = window.prompt("Enter the name of the new column:");
        newColumn ? setAdditionalColumn(newColumn) : null;
    };

    const handleCheckboxChange = (recordKey: string, group: string) => {
        setSelectedCheckboxes(prevState => ({
            ...prevState, [recordKey]: prevState[recordKey] === group ? null : group,
        }));
    };

    const renderCheckboxes = (record: any, group: any) => {
        return (
            <div key={`${record.key}-${group}`}>
                <input type={"checkbox"} checked={selectedCheckboxes[record.key] === group}
                       onChange={() => handleCheckboxChange(record.key, group)}/>
            </div>
        );
    };

    const columns = [
        {
            title: 'Node Label', dataIndex: 'label', key: 'label', render: (_: string, record: any) =>
                <span>{record.style.label.value}</span>,
        },
        ...groups.map(group => ({
            title: group, dataIndex: group, key: group, render: (_: string, record: any) =>
                renderCheckboxes(record, group),
        })),
    ].filter(Boolean) as unknown as ColumnsType;

    useEffect(() => {
        additionalColumn ? setGroups([...groups, (additionalColumn as unknown as string)]) : null;
    }, [additionalColumn]);

    const dataSource = props.nodes.map((node, index) => ({
        key: index,
        ...node
    }));

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={dataSource}/>
        </div>
    );
}
