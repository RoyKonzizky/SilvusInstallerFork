import {useEffect, useState} from 'react';
import {ITopologyProps} from "./ITopologyProps";
import {TopologyGraph} from "./graph/TopologyGraph";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {createEdgesFromData, createNodesFromData} from "../../../utils/topologyUtils/graphUtils.ts";
import {batteriesType, devicesType, snrsType} from "../../../constants/types/devicesDataTypes.ts";
import useWebSocket from "react-use-websocket";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {updateEdges, updateNodes} from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";

export function Topology(props: ITopologyProps) {
    const topologyDispatch = useDispatch();
    const topologySelector = useSelector((state: RootState) => state.topologyGroups);
    const [devices, setDevices] =
        useState<devicesType | null>(null);
    const [batteries, setBatteries] =
        useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] =
        useState<snrsType | null>(null);
    const ws_url = "ws://localhost:8080/ws";
    const { lastJsonMessage } = useWebSocket(
        ws_url, {
            share: true,
            shouldReconnect: () => true, onError: (error) => console.error('WebSocket error:', error),
            onOpen: () => console.log('WebSocket connected'), onClose: () => console.log('WebSocket disconnected'),
        }
    );
    const {t} = useTranslation();

    useEffect(() => {
        if (lastJsonMessage) {
            try {
                const newData = lastJsonMessage as { type: string, data: any };
                // console.log('Parsed WebSocket message:', newData);// console.log('Message type:', newData.type);
                if (newData.type === 'net-data') {
                    const { 'device-list': deviceList, 'snr-list': snrList } = newData.data;
                    setDevices(deviceList);
                    setSnrsData(snrList);
                } else if (newData.type === 'battery') {
                    setBatteries(newData.data);
                } else {
                    console.log('Unknown message type:', newData.type);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        if (devices && batteries && snrsData) {
            const nodes: IUserNode[] = createNodesFromData(devices, batteries);
            const edges: IUserEdge[] = createEdgesFromData(snrsData);
            try {
                topologyDispatch(updateNodes(nodes));
                topologyDispatch(updateEdges(edges));
            } catch (error) {console.error('Error in loading data:', error);}
        }
    }, [devices, batteries, snrsData]);

    return (
        <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' : 
                'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {(topologySelector.edges && topologySelector.edges) ? (<TopologyGraph/>) : <h1 className={"h-24 w-36"}>{t('loading')}</h1>}
        </div>
    );
}
