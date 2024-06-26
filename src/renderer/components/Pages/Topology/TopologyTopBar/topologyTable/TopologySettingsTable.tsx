import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RestNode } from "@antv/graphin/es/typings/type";
import {createDataSource, getColumns, isIUserNode, convertSelectedOptionsToHulls, convertHullsToSelectedOptions,
    sendPttGroups,} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { RootState } from "../../../../../redux/store.ts";
import { GroupAdditionModal } from "./GroupAdditionModal.tsx";

interface ITopologySettingsTable {
    groups: string[],
    nodes: (IUserNode | RestNode)[],
    resetOnClose: boolean,
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullOptions = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const initialSelectedOptions =
        convertHullsToSelectedOptions(hullOptions, props.nodes as unknown as IUserNode[]);
    const [selectedOptions, setSelectedOptions] =
        useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [groups, setGroups] =
        useState<string[]>(props.groups.length ? props.groups : Object.keys(initialSelectedOptions));
    const [nodes, setNodes] =
        useState<(IUserNode | RestNode)[]>(props.nodes);

    const handleAddGroup = (groupName: string) => {
        setGroups((prevGroups) => [...prevGroups, groupName]);
    };

    const handleSelectChange = (group: string, nodeId: string, value: number | null) => {
        const newValue = value ?? 0;
        setSelectedOptions((prevOptions) =>
            ({...prevOptions, [group]: { ...prevOptions[group], [nodeId]: newValue }}));
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (isIUserNode(node) && node.id === nodeId) {
                    const updatedStatuses = groups.map((grp) => selectedOptions[grp]?.[node.id] ?? 0);
                    updatedStatuses[groups.indexOf(group)] = newValue;
                    return {...node, data: {...node.data, statuses: updatedStatuses,},};
                }
                return node;
            })
        );
    };

    useEffect(() => {
        dispatch(updateHulls(convertSelectedOptionsToHulls(groups, nodes as IUserNode[], selectedOptions)));
    }, [selectedOptions, groups, dispatch, nodes, props.resetOnClose]);

    useEffect(() => {
        sendPttGroups(hullOptions, nodes as IUserNode[]);
    }, [hullOptions, nodes, props.resetOnClose]);

    useEffect(() => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (isIUserNode(node)) {
                    const updatedStatuses= groups.map((group)=>selectedOptions[group]?.[node.id] ?? 0);
                    return {...node, data: {...node.data, statuses: updatedStatuses,},};
                }
                return node;
            })
        );
    }, [groups, selectedOptions]);

    return (
        <div>
            <GroupAdditionModal groups={groups} nodes={nodes as IUserNode[]} selectedOptions={selectedOptions}
                                onAdd={handleAddGroup} />
            <Table className={'bottom-0'} columns={getColumns(groups, selectedOptions, handleSelectChange)}
                   dataSource={createDataSource(nodes as IUserNode[])} />
        </div>
    );
}