import {useEffect, useState} from 'react';
import {ITopologyProps} from "./ITopologyProps";
import {TopologyGraph} from "./graph/TopologyGraph";
import axios from 'axios';
import {IUserEdge, IUserNode} from "@antv/graphin";
import {createEdgesFromData, createNodesFromData} from "../../../utils/topologyUtils/graphUtils.ts";
import {batteriesType, devicesType, snrsType} from "../../../utils/webConnectionUtils.ts";

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] = useState<devicesType | null>(null);
    const [batteries, setBatteries] = useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] = useState<snrsType | null>(null);
    const [graphData, setGraphData] = useState<{ nodes: IUserNode[], edges: IUserEdge[] } | null>(null);
    const radioIp = '172.20.238.213';
    const ws = new WebSocket("ws://localhost:8080/ws");
    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    useEffect(() => {
        const sendRadioIpToServer = async () => {
            try {
                const response = await axios.post('http://localhost:8080/set-radio-ip', {radio_ip: radioIp});
                console.log('Radio IP sent successfully:', response.data);
            } catch (error) {
                console.error('Error sending radio IP:', error);
            }
        };
        sendRadioIpToServer();
    }, []);

    useEffect(() => {
        ws.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
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
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (devices && batteries && snrsData) {
                try {
                    const nodes = createNodesFromData(devices, batteries);
                    const edges = createEdgesFromData(snrsData);
                    setGraphData({nodes, edges});
                } catch (error) {
                    console.error('Error in loading data:', error);
                }
            }
        };
        loadData();
    }, [devices, batteries, snrsData]);

    return (
        <div
            className={`${props.isSmaller ? 'w-[35%] h-[35%]' : 'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {graphData ? (<TopologyGraph graphData={graphData}/>) : <h1 className={"h-24 w-36"}>LOADING</h1>}
        </div>
    );
}
