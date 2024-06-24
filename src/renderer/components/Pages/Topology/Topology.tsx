import {useEffect, useState} from 'react';
import {ITopologyProps} from "./ITopologyProps";
import {TopologyGraph} from "./graph/TopologyGraph";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {createEdgesFromData, createNodesFromData} from "../../../utils/topologyUtils/graphUtils.ts";
import {batteriesType, devicesType, snrsType} from "../../../utils/webConnectionUtils.ts";
import useWebSocket from "react-use-websocket";

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] =
        useState<devicesType | null>(null);
    const [batteries, setBatteries] =
        useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] =
        useState<snrsType | null>(null);
    const [graphData, setGraphData] =
        useState<{ nodes: IUserNode[], edges: IUserEdge[] } | null>(null);
    const ws_url = "ws://localhost:8080/ws";
    const { lastJsonMessage } = useWebSocket(
        ws_url, {
            share: true,
            shouldReconnect: () => true, onError: (error) => console.error('WebSocket error:', error),
            onOpen: () => console.log('WebSocket connected'), onClose: () => console.log('WebSocket disconnected'),
        }
    );

    useEffect(() => {
        if (lastJsonMessage) {
            try {
                const newData = lastJsonMessage as { type: string, data: any };
                console.log('Parsed WebSocket message:', newData);
                console.log('Message type:', newData.type);

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
            try {
                setGraphData({nodes: createNodesFromData(devices, batteries),
                    edges: createEdgesFromData(snrsData)});
            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [devices, batteries, snrsData]);

    return (
        <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' : 
                'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {graphData ? (<TopologyGraph graphData={graphData}/>) : <h1 className={"h-24 w-36"}>LOADING</h1>}
        </div>
    );
}
