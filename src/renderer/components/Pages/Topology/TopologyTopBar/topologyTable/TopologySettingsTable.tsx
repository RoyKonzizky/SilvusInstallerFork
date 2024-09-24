import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import {updateHulls, updateNodes} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {convertNodesToHulls, createColumns, createDataSource, handleAddGroup, handleStatusChange, createGroups,
    checkIfUnassignedToGroup, updateBatteryInfo,} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { GroupAdditionModal } from "./GroupAdditionModal.tsx";
import { t } from "i18next";
import { HullCfg, IUserNode } from "@antv/graphin";
import i18n from "../../../../../i18n.ts";

interface ITopologySettingsTable {
    onSave: (hullOptions: HullCfg[], nodes: IUserNode[]) => void,
    resetOnClose: boolean,
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullsSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const [nodes, setNodes] = useState(nodesSelector);
    const [hulls, setHulls] = useState(hullsSelector);
    const [groups, setGroups] = useState<string[]>(createGroups(hullsSelector));
    const [camerasMap, setCamerasMap] = useState({});
    const [dataSource, setDataSource] = useState<any[]>(createDataSource(nodesSelector, groups));

    const [columns, setColumns] =
        useState(createColumns(groups, nodes, hulls, camerasMap, dispatch, updateNodes, updateHulls,
            (nodeId: string, groupIndex: number, status: number) => {
                const updatedNodes = handleStatusChange(nodes, nodeId, groupIndex, status, dispatch, updateNodes);
                setNodes(updatedNodes);
            },
            () => updateBatteryInfo, camerasMap, setCamerasMap
        ));

    useEffect(() => {
        setNodes(nodesSelector);
    }, [nodesSelector]);

    useEffect(() => {
        setNodes(prevNodes => checkIfUnassignedToGroup(prevNodes));
        dispatch(updateNodes(nodes));
    }, [groups]);

    useEffect(() => {
        setDataSource(createDataSource(nodes, groups));
    }, [nodes, groups]);

    useEffect(() => {
        setColumns(createColumns(groups, nodes, hulls, camerasMap, dispatch, updateNodes, updateHulls,
            (nodeId: string, groupIndex: number, status: number) => {
                const updatedNodes = handleStatusChange(nodes, nodeId, groupIndex, status, dispatch, updateNodes);
                setNodes(updatedNodes);
            },
            updateBatteryInfo, camerasMap, setCamerasMap
        ));
    }, [groups, nodes, hulls]);

    useEffect(() => {
        const newHulls = convertNodesToHulls(nodes, hulls);
        setHulls(newHulls);
        dispatch(updateHulls(newHulls));
    }, [nodes]);

    useEffect(() => {
        setHulls(hullsSelector);
    }, [hullsSelector]);

    useEffect(() => {
        const newGroups = createGroups(hulls);
        setGroups(newGroups);
    }, [hulls]);

    return (
        <>
            <GroupAdditionModal groups={groups} nodes={nodes} onAdd={(groupName) =>
                handleAddGroup(groupName, groups, setGroups, nodes, setNodes, hulls,
                    setHulls, dispatch, updateNodes, updateHulls)} />
            <Table dataSource={dataSource} columns={columns} rowKey="key" className={'bottom-0'}
                style={{ direction: i18n.language === 'en' ? 'ltr' : 'rtl', overflow: 'auto', }} />
            <Button onClick={() => props.onSave(hulls, nodes)} className={'text-black h-14 w-40 m-5 rounded-xl'}>
                {t("ApplySettings")}
            </Button>
        </>
    );
}
