import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Button, Table, message } from "antd";
import { IUserNode } from "@antv/graphin";
import { updateHulls } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RestNode } from "@antv/graphin/es/typings/type";
import {createDataSource, getColumns, isIUserNode, convertSelectedOptionsToHulls, convertHullsToSelectedOptions,
} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import {RootState} from "../../../../../redux/store.ts";
import { useTranslation } from 'react-i18next';

interface ITopologySettingsTable {
    groups: string[],
    nodes: (IUserNode | RestNode)[],
    resetOnClose: boolean
}

export function TopologySettingsTable(props: ITopologySettingsTable) {
    const dispatch = useDispatch();
    const hullOptions = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const initialSelectedOptions = convertHullsToSelectedOptions(hullOptions,
        props.nodes as unknown as IUserNode[]);
    const initialGroups = props.groups.length ? props.groups : Object.keys(initialSelectedOptions);
    const [selectedOptions, setSelectedOptions] =
        useState<{ [group: string]: { [nodeId: string]: number } }>(initialSelectedOptions);
    const [groups, setGroups] = useState<string[]>(initialGroups);
    const [additionalColumn, setAdditionalColumn] =
        useState<string | null>(null);
    const [nodes, setNodes] = useState<(IUserNode | RestNode)[]>(props.nodes);
    const { t, } = useTranslation();

    function handleAddColumn() {
        if (groups.length >= 15) return(message.warning(t('handleAddColumnWarning')));
        const newColumn = window.prompt(t('handleAddColumnPrompt'));
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
        const updatedHulls = convertSelectedOptionsToHulls(groups, nodes as IUserNode[],
            selectedOptions);
        dispatch(updateHulls(updatedHulls));
    }, [selectedOptions, groups, dispatch, nodes, props.resetOnClose]);

    const columns = getColumns(groups, selectedOptions, handleSelectChange);

    return (
        <div>
            <Button onClick={handleAddColumn} className={'mb-2'}>{t("AddGroup")}</Button>
            <Table className={'bottom-0'} columns={columns} dataSource={createDataSource(nodes as IUserNode[])} />
        </div>
    );
}
