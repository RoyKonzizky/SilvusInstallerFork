import { useEffect, useState } from 'react';
import { ITopologyProps } from "./ITopologyProps";
import { TopologyGraph } from "./graph/TopologyGraph";
import { createEdgesFromData, createNodesFromData } from "../../../utils/topologyUtils/graphUtils.ts";
import { batteriesType, devicesType, snrsType } from "../../../constants/types/devicesDataTypes.ts";
import useWebSocket from "react-use-websocket";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { updateNodes } from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RootState } from "../../../redux/store.ts";
import { IUserEdge, IUserNode } from "@antv/graphin";

interface TopologyData {
    devices: devicesType;
    batteries: batteriesType;
    snrsData: snrsType;
}

export function Topology(props: ITopologyProps) {
    const ws_url = "ws://localhost:8080/ws";

    const [topologyData, setTopologyData] = useState<TopologyData>({
        devices: [],
        batteries: [],
        snrsData: []
    });
    const { lastJsonMessage } = useWebSocket(
        ws_url, {
        share: true,
        shouldReconnect: () => true, onError: (error) => console.error('WebSocket error:', error),
        onOpen: () => console.log('WebSocket connected'), onClose: () => console.log('WebSocket disconnected'),
    }
    );
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [edges, setEdges] = useState<IUserEdge[]>([]);
    const [nodes, setNodes] = useState<IUserNode[]>([]);
    const [isCurrentlyDragged, setIsCurrentlyDragged] = useState<boolean>(false);

    useEffect(() => {
        if (lastJsonMessage && !isCurrentlyDragged) {
            const {
                type,
                data,
                has_changed
            } = lastJsonMessage as { type: string; data: any; has_changed: boolean };

            try {
                if (type === 'net_data') {
                    const { device_list, snr_list } = data;
                    setTopologyData(prevState => ({
                        ...prevState,
                        devices: (!topologyData.devices?.length || has_changed) ? device_list : prevState.devices,
                        snrsData: snr_list,
                    }));
                } else if (type === 'battery') {
                    setTopologyData(prevState => ({
                        ...prevState,
                        batteries: data,
                    }));
                } else {
                    console.log('Unknown message type:', type);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        const { devices, batteries, snrsData } = topologyData;
        if (devices && !isCurrentlyDragged) {
            try {
                const newNodes = createNodesFromData(devices, batteries);
                const newEdges = createEdgesFromData(snrsData);

                const updatedNodes = newNodes.map(newNode => {
                    const existingNode = selector.nodes.find(node => node.id === newNode.id);
                    return existingNode ? {
                        ...existingNode,
                        data: { ...existingNode.data, battery: newNode.data.battery }
                    } : newNode;
                });

                dispatch(updateNodes(updatedNodes));
                setNodes(updatedNodes);
                setEdges(newEdges);
            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [topologyData]);

    return (
        <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' : 'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {
                selector.nodes?.length > 0 ?
                    <TopologyGraph
                        nodes={nodes}
                        edges={edges}
                        setDraggingState={(isDragged: boolean) => setIsCurrentlyDragged(isDragged)}
                    />
                    : <h1 className={"h-24 w-36"}>{t('loading')}</h1>
            }
        </div>
    );
}