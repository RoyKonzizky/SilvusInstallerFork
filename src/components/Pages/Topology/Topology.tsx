import { useEffect, useState } from 'react';
import { ITopologyProps } from "./ITopologyProps.ts";
import { TopologyGraph } from "./graph/TopologyGraph.tsx";
import {
    colorOffline,
    colorOnline,
    createEdgesFromData,
    createNodesFromData
} from "../../../utils/topologyUtils/graphUtils.ts";
import { devicesType, snrsType } from "../../../constants/types/devicesDataTypes.ts";
import useWebSocket from "react-use-websocket";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import {updateEdges, updateNodes} from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RootState } from "../../../redux/store.ts";
import { IUserEdge, IUserNode } from "@antv/graphin";

export function Topology(props: ITopologyProps) {
    const [devices, setDevices] = useState<devicesType | null>(null);
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
    const sizeIntervalSelector = useSelector((state: RootState) => state.topologyGroups.sizeInterval);
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
                }
                else {
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
                const newNodes = createNodesFromData(devices, selector.sizeInterval);
                const newEdges = createEdgesFromData(snrsData!, selector.sizeInterval);
                //TODO refactor to remove this part cause the change made this part pretty obsolete
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

                            style: {
                                ...existingNode.style,
                                keyshape: {
                                    ...existingNode.style?.keyshape,
                                    fill: newNode.data.isOnline ? colorOnline : colorOffline,
                                    stroke: newNode.data.isOnline ? colorOnline : colorOffline,
                                }
                            },
                            data: {
                                ...existingNode.data,
                                isOnline: newNode.data.isOnline
                            }
                        };
                    }
                    return newNode;
                });

                dispatch(updateEdges(edges));
                dispatch(updateNodes(updatedNodes));
                setNodes(updatedNodes);
                setEdges(newEdges);

            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [devices, snrsData, sizeIntervalSelector]);

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