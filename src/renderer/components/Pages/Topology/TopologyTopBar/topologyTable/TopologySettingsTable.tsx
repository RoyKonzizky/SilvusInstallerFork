import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RestNode } from "@antv/graphin/es/typings/type";
import {createDataSource, getColumns, isIUserNode, convertSelectedOptionsToHulls, convertHullsToSelectedOptions,
} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { RootState } from "../../../../../redux/store.ts";
import { GroupAdditionModal } from "./GroupAdditionModal.tsx";
import { useTranslation } from 'react-i18next';

interface ITopologySettingsTable {
    groups: string[];
    nodes: (IUserNode | RestNode)[];
    resetOnClose: boolean;
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullOptions = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const initialSelectedOptions = convertHullsToSelectedOptions(hullOptions, props.nodes as unknown as IUserNode[]);
    const initialGroups = props.groups.length ? props.groups : Object.keys(initialSelectedOptions);
    const [selectedOptions, setSelectedOptions] = useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [groups, setGroups] = useState<string[]>(initialGroups);
    const [nodes, setNodes] = useState<(IUserNode | RestNode)[]>(props.nodes);
    const { t, } = useTranslation();

    const handleAddGroup = (groupName: string) => {
        setGroups((prevGroups) => [...prevGroups, groupName]);
    };

    const handleSelectChange = (group: string, nodeId: string, value: number | null) => {
        const newValue = value ?? 0;
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [group]: { ...prevOptions[group], [nodeId]: newValue }
        }));
        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (isIUserNode(node) && node.id === nodeId) {
                    return { ...node, data: { ...node.data, [group]: newValue } };
                }
                return node;
            })
        );
    };

    useEffect(() => {
        const updatedHulls = convertSelectedOptionsToHulls(groups, nodes as IUserNode[], selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, dispatch, nodes, props.resetOnClose]);

    const columns = getColumns(groups, selectedOptions, handleSelectChange, t);

    return (
        <div>
            <GroupAdditionModal groups={groups} nodes={nodes as IUserNode[]} selectedOptions={selectedOptions}
                                onAdd={handleAddGroup} />
            <Table className={'bottom-0'} columns={columns} dataSource={createDataSource(nodes as IUserNode[])} />
        </div>
    );
}
