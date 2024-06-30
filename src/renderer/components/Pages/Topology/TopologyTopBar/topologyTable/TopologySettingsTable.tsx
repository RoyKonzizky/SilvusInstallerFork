import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {createDataSource, getColumns, convertSelectedOptionsToHulls, convertHullsToSelectedOptions, sendPttGroups,
    isIUserNode, handleAddGroup, handleDeleteGroup, handleSelectChange}
    from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { RootState } from "../../../../../redux/store.ts";
import { GroupAdditionModal } from "./GroupAdditionModal.tsx";

interface ITopologySettingsTable {
    groups: string[],
    nodes: IUserNode[],
    resetOnClose: boolean,
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullOptions = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const initialSelectedOptions = convertHullsToSelectedOptions(hullOptions, props.nodes);
    const [selectedOptions, setSelectedOptions] =
        useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [groups, setGroups] =
        useState<string[]>(props.groups.length ? props.groups : Object.keys(initialSelectedOptions));
    const [nodes, setNodes] = useState<IUserNode[]>(props.nodes);

    useEffect(() => {
        dispatch(updateHulls(convertSelectedOptionsToHulls(groups, nodes, selectedOptions)));
    }, [selectedOptions, groups, nodes, props.resetOnClose]);

    useEffect(() => {
        sendPttGroups(hullOptions, nodes);
    }, [props.resetOnClose]);

    useEffect(() => {
        setNodes((prevNodes) => prevNodes.map((node) => {
            if (isIUserNode(node)) {
                const updatedStatuses = groups.map((group) => selectedOptions[group]?.[node.id] ?? 0);
                return { ...node, data: { ...node.data, statuses: updatedStatuses } };
            }
            return node;
        }));
    }, [groups, selectedOptions]);

    useEffect(() => {
        if (hullOptions.length > 0) {
            for (let i = 0; i < nodes.length; i++) {
                setSelectedOptions((prevOptions) => ({ ...prevOptions, [groups[0]]: { ...prevOptions[groups[0]], [nodes[i].id]: 1 } }));
                setNodes((prevNodes) => prevNodes.map((node) => {
                    if (isIUserNode(node) && node.id === nodes[i].id) {
                        const updatedStatuses = groups.map((grp) => selectedOptions[grp]?.[node.id] ?? 0);
                        updatedStatuses[0] = 1;
                        return { ...node, data: { ...node.data, statuses: updatedStatuses } };
                    }
                    return node;
                }));
            }
        }
    }, []);

    return (
        <div>
            <GroupAdditionModal groups={groups} nodes={nodes} selectedOptions={selectedOptions}
                                onAdd={(groupName) => handleAddGroup(groupName, groups, setGroups)} />
            <Table className={'bottom-0'}
                   columns={getColumns(groups, selectedOptions,
                       (group, nodeId, value) =>
                           handleSelectChange(group, nodeId, value, groups, setSelectedOptions, setNodes, selectedOptions),
                       (groupName) =>
                           handleDeleteGroup(groupName, groups, setGroups, setSelectedOptions))}
                   dataSource={createDataSource(nodes)}/>
        </div>
    );
}
