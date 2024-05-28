import {useEffect, useState} from 'react';
import {ITopologyProps} from "./ITopologyProps";
import {TopologyGraph} from "./graph/TopologyGraph";
import axios from 'axios';
import {IUserEdge, IUserNode} from "@antv/graphin";
import {createEdgesFromData, createNodesFromData} from "../../../utils/topologyUtils/graphSetup.ts";

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] = useState<null | { radio_ip: string, node_ids: string[], node_ips: string[] }>(null);
    const [batteries, setBatteries] = useState(null);
    const [snrsData, setSnrsData] = useState<[[id1: string, id2: string], string] | null>(null);
    const [graphData, setGraphData] = useState<{ nodes: IUserNode[], edges: IUserEdge[] } | null>(null);
    const radioIp = '172.20.238.213';

    useEffect(() => {
        const sendRadioIpToServer = async () => {
            try {
                const response = await axios.post('http://localhost:8080/set-radio-ip', {radio_ip: radioIp});
                console.log('Radio IP sent successfully:', response.data);
            } catch (error) {
                console.error('Error sending radio IP:', error);
            }
        };

        const fetchData = async () => {
            try {
                const [batteryResponse, netResponse,
                    snrsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/get-battery'),
                    axios.get('http://localhost:8080/net-data'),
                    axios.get('http://localhost:8080/get-snrs')
                ]);
                console.log('Battery data received:', batteryResponse.data);
                setBatteries(batteryResponse.data);
                console.log('Net-data received:', netResponse.data);
                setDevices(netResponse.data);
                console.log('SNRS data received:', snrsResponse.data);
                setSnrsData(snrsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        sendRadioIpToServer();
        fetchData();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (devices && batteries && snrsData) {
                try {
                    const nodes = createNodesFromData(devices, batteries);
                    const edges = createEdgesFromData(snrsData, nodes);
                    setGraphData({nodes, edges});
                    console.log(graphData);
                } catch (error) {
                    console.error('Error in loading data:', error);
                }
            }
        };

        loadData();
    }, [devices, batteries, snrsData]);

    return (
        <div
            className={`${props.isSmaller ? "w-[35%] h-[35%]" : "w-full h-full border border-black bg-black"} block absolute overflow-hidden`}>
            {graphData ? (<TopologyGraph graphData={graphData}/>) : <h1 className={"h-24 w-36"}>LOADING</h1>}
        </div>
    );
}
