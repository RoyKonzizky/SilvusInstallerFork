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

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] = useState<devicesType | null>(null);
    const [batteries, setBatteries] = useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] = useState<snrsType | null>(null);
    const ws_url = "ws://localhost:8080/ws";
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
            const { type, data, has_changed } = lastJsonMessage as { type: string; data: any; has_changed: boolean };

            try {
                if (type === 'net_data') {
                    const { device_list, snr_list } = data;

                    if (!devices || has_changed) {
                        setDevices(device_list);
                    }

                    setSnrsData(snr_list);
                } else if (type === 'battery') {
                    setBatteries(data);
                } else {
                    console.log('Unknown message type:', type);
                }
            } catch (error) {
                console.error('Error handling WebSocket message:', error);
            }
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        if (devices && !isCurrentlyDragged) {
            try {
                const newNodes = createNodesFromData(devices, batteries!);
                const newEdges = createEdgesFromData(snrsData!);
                //refactor to remove this part cause the change made this part pretty obsolete
                const updatedNodes = newNodes.map(newNode => {
                    const existingNode = selector.nodes
                        .find((node: IUserNode) => node.id === newNode.id);
                    if (existingNode) {
                        return {
                            ...existingNode,
                            // data: {
                            //     ...existingNode.data,
                            //     battery: existingNode.data.battery
                            // }
                        };
                    }
                    return newNode;
                });

                // dispatch(updateEdges(edges));
                dispatch(updateNodes(updatedNodes));
                setNodes(updatedNodes);
                setEdges(newEdges);

            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [devices, batteries, snrsData]);

    return (
        <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' : 'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {
                selector.nodes?.length > 0 ? <TopologyGraph nodes={nodes} edges={edges}
                        setDraggingState={(isDragged: boolean) => setIsCurrentlyDragged(isDragged)}/>
                     : <h1 className={"h-24 w-36"}>{t('loading')}</h1>
            }
        </div>
    );
}

// //Make sure both of the values of the useMemo are the same
// const derivedData: {nodes: IUserNode[], edges: IUserEdge[]} = useMemo(() => {
//     if (devices) {
//         const newNodes = createNodesFromData(devices, batteries!);
//         const newEdges = createEdgesFromData(snrsData!);
//
//         const updatedNodes = newNodes.map(newNode => {
//             // sync server data with existing nodes in redux:
//             const existingNode = selector.nodes.find(node => node.id === newNode.id);
//             if (existingNode) {
//                 return {
//                     ...existingNode,
//                     data: {
//                         ...existingNode.data,
//                         battery: newNode.data.battery
//                     },
//                     x: existingNode.x,
//                     y: existingNode.y
//                 };
//             }
//             return newNode;
//         });
//
//         return { nodes: updatedNodes, edges: newEdges };
//     }
//     return { nodes: [], edges: [] };
// }, [devices, batteries, snrsData]);
//
// useEffect(() => {
//     if (derivedData?.nodes?.length && derivedData.edges?.length) {
//         try {
//             // dispatch(updateEdges(derivedData.edges));
//             dispatch(updateNodes(derivedData.nodes));
//             setNodes(derivedData.nodes);
//             setEdges(derivedData.edges);
//         } catch (error) {
//             console.error('Error in loading data:', error);
//         }
//     }
// }, [derivedData]);