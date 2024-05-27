import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { Button, Table, message } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RestNode } from "@antv/graphin/es/typings/type";
import { createDataSource, getColumns, isIUserNode, updateHullOptions, selectedOptionsType } from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";

interface ITopologySettingsTable {
    groups: string[],
    nodes: (IUserNode | RestNode)[],
    resetOnClose: boolean
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const [additionalColumn, setAdditionalColumn] = useState<string | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<selectedOptionsType>({});
    const [groups, setGroups] = useState<string[]>(props.groups);
    const [nodes, setNodes] = useState<(IUserNode | RestNode)[]>(props.nodes);
    const dispatch = useDispatch();

    function handleAddColumn() {
        if (groups.length >= 15) return(message.warning("You can only add up to 15 groups."));

        const newColumn = window.prompt("Enter the name of the new column:");
        if (newColumn) setAdditionalColumn(newColumn);
    }

    function handleSelectChange(group: string, nodeId: string, value: number | null) {
        const newValue = value ?? 0;
        setSelectedOptions(prevOptions => ({
            ...prevOptions, [group]: { ...prevOptions[group], [nodeId]: newValue }
        }));
        setNodes(prevNodes =>
            prevNodes.map(node => {
                if (isIUserNode(node) && node.id === nodeId) return {...node, data: {...node.data, [group]: newValue}};
                return node;
            })
        );
    }

    useEffect(() => {
        if (additionalColumn) setGroups([...groups, additionalColumn]);
    }, [additionalColumn]);

    useEffect(() => {
        const updatedHulls = updateHullOptions(groups, nodes as IUserNode[], selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, dispatch, nodes, props.resetOnClose]);

    const columns = getColumns(groups, selectedOptions, handleSelectChange);

    return (
        <div>
            <Button onClick={handleAddColumn} className="mb-2">Add Group</Button>
            <Table className={"bottom-0"} columns={columns} dataSource={createDataSource(nodes as IUserNode[])} />
        </div>
    );
}
