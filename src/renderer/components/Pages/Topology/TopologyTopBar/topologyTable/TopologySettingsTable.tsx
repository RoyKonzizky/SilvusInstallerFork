import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Table} from "antd";
import {IUserNode} from "@antv/graphin";
import {updateHulls} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {assignNodesIfNotInGroup, convertHullsToSelectedOptions, convertSelectedOptionsToHulls, createDataSource, getColumns,
    handleAddGroup, handleDeleteGroup, handleSelectChange, sendPttGroups
} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import {RootState} from "../../../../../redux/store.ts";
import {GroupAdditionModal} from "./GroupAdditionModal.tsx";
import {useTranslation} from 'react-i18next';
import {HullCfg} from "@antv/graphin/lib/components/Hull";

interface ITopologySettingsTable {
    resetOnClose: boolean,
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullsSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const initialSelectedOptions = convertHullsToSelectedOptions(hullsSelector, nodesSelector);
    const [selectedOptions, setSelectedOptions] = useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [nodes, setNodes] = useState<IUserNode[]>(nodesSelector);
    const [hulls, setHulls] = useState<HullCfg[]>(hullsSelector);
    const initialGroups = hulls.length > 0 ? hulls.map(hull => hull.id) : [];
    const filteredGroups = initialGroups.filter(group => typeof group === 'string') as string[];
    const [groups, setGroups] = useState<string[]>(filteredGroups);
    const [dataSource, setDataSource] = useState(createDataSource(nodes));
    const { t } = useTranslation();
    const [columns, setColumns] = useState(getColumns(groups, selectedOptions, (group, nodeId, value) =>
            handleSelectChange(group, nodeId, value, groups, setSelectedOptions, setNodes, selectedOptions),
        (groupName) =>
            handleDeleteGroup(groupName, groups, setGroups, setSelectedOptions), t));

    useEffect(() => {
        setHulls(convertSelectedOptionsToHulls(groups, nodes, selectedOptions));
        setDataSource(createDataSource(nodes));
        dispatch(updateHulls(hulls));
    }, [nodes, selectedOptions]);

    useEffect(() => {
        sendPttGroups(hulls, nodes);
    }, [props.resetOnClose]);

    useEffect(() => {
        setNodes((prevNodes) => prevNodes.map((node) => {
            const updatedStatuses = groups.map((group) => selectedOptions[group]?.[node.id] ?? 0);
            return { ...node, data: { ...node.data, statuses: updatedStatuses } };
        }));
    }, [groups, selectedOptions]);

    useEffect(() => {
        assignNodesIfNotInGroup(nodes, selectedOptions, groups, setSelectedOptions, setNodes);
    }, [hulls, groups, nodes, selectedOptions]);

    useEffect(() => {
        setNodes(nodesSelector);

        setHulls((prevHulls) => {
            return prevHulls.map(hull => {
                const updatedMembers = hull.members
                    .filter(memberId => nodes.find(node => node.id === memberId));
                return {...hull, members: updatedMembers};
            });
        });

        setSelectedOptions(convertHullsToSelectedOptions(hulls, nodes));

        setColumns(getColumns(groups, selectedOptions, (group, nodeId, value) =>
                handleSelectChange(group, nodeId, value, groups, setSelectedOptions, setNodes, selectedOptions),
            (groupName) =>
                handleDeleteGroup(groupName, groups, setGroups, setSelectedOptions), t));
    }, [nodesSelector]);

    return (
        <div>
            <GroupAdditionModal groups={groups} nodes={nodes} selectedOptions={selectedOptions}
                                onAdd={(groupName) => handleAddGroup(groupName, groups, setGroups)} />
            <Table className={'bottom-0'} columns={columns} dataSource={dataSource} />
        </div>
    );
}