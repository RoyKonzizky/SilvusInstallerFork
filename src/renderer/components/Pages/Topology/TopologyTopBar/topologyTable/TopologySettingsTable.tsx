import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { useEffect, useState } from "react";
import { Table } from "antd";
import {updateHulls, updateNodes} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {
    convertNodesToHulls,
    createColumns,
    createDataSource,
    createGroups,
    handleStatusChange
} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";

interface ITopologySettingsTable {
    resetOnClose: boolean,
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullsSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const [nodes, setNodes] = useState(nodesSelector);
    const [hulls, setHulls] = useState(hullsSelector);
    const [groups, setGroups] = useState<string[]>([]);
    const [dataSource, setDataSource] = useState<any[]>(createDataSource(nodes, groups));
    const [columns, setColumns] =
        useState(createColumns(groups, (nodeId: string, groupIndex: number, status: number) => {
            const updatedNodes = handleStatusChange(nodes, nodeId, groupIndex, status, dispatch, updateNodes);
            setNodes(updatedNodes);
    }));

    useEffect(() => {
        setNodes(nodesSelector);
    }, [nodesSelector]);

    useEffect(() => {
        setHulls(hullsSelector);
    }, [hullsSelector]);

    useEffect(() => {
        const newGroups = createGroups(hulls);
        setGroups(newGroups);
    }, [hulls]);

    useEffect(() => {
        setDataSource(createDataSource(nodes, groups));
    }, [nodes, groups]);

    useEffect(() => {
        setColumns(createColumns(groups, (nodeId: string, groupIndex: number, status: number) => {
            const updatedNodes = handleStatusChange(nodes, nodeId, groupIndex, status, dispatch, updateNodes);
            setNodes(updatedNodes);
        }));
    }, [groups, nodes]);

    useEffect(() => {
        setHulls(convertNodesToHulls(nodes, hulls));
        dispatch(updateHulls(hulls));
    }, [nodes]);

    return (
        <>
            <Table dataSource={dataSource} columns={columns} rowKey="key" className={'bottom-0'} />
        </>
    );
}