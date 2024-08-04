import { useEffect, useState } from 'react';
import { ITopologyProps } from "./ITopologyProps";
import TopologyGraph from "./graph/TopologyGraph";
import { createEdgesFromData, createNodesFromData } from "../../../utils/topologyUtils/graphUtils.ts";
import { batteriesType, devicesType, snrsType } from "../../../constants/types/devicesDataTypes.ts";
import useWebSocket from "react-use-websocket";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { updateEdges, updateNodes } from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RootState } from "../../../redux/store.ts";

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] = useState<devicesType | null>(null);
    const [batteries, setBatteries] = useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] = useState<snrsType | null>(null);
    const ws_url = "ws://localhost:8080/ws";
    const { lastJsonMessage } = useWebSocket(
        ws_url, {
        share: true,
        shouldReconnect: () => true,
        onError: (error) => console.error('WebSocket error:', error),
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected')
    }
    );
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { nodes, edges } = useSelector((state: RootState) => state.topologyGroups);

    useEffect(() => {
        if (lastJsonMessage) {
            try {
                const newData = lastJsonMessage as { type: string, data: any };
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
                const newNodes = createNodesFromData(devices, batteries);
                const edges = createEdgesFromData(snrsData);

                const updatedNodes = newNodes.map(newNode => {
                    // sync server data with existing nodes in redux:
                    const existingNode = nodes.find(node => node.id === newNode.id);
                    if (existingNode) {
                        return {
                            ...existingNode,
                            data: {
                                ...existingNode.data,
                                battery: newNode.data.battery
                            },
                            x: existingNode.x,
                            y: existingNode.y
                        };
                    }
                    return newNode;
                });

                dispatch(updateEdges(edges));
                dispatch(updateNodes(updatedNodes));
            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [devices, batteries, snrsData]);

    return (
        <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' :
            'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {
                nodes?.length > 0 ? <TopologyGraph />
                    : <h1 className={"h-24 w-36"}>{t('loading')}</h1>
            }
        </div>
    );
}
