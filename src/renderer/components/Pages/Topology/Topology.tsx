import { useEffect, useMemo, useState } from 'react';
import { ITopologyProps } from "./ITopologyProps";
import TopologyGraph from "./graph/TopologyGraph";
import { createEdgesFromData, createNodesFromData } from "../../../utils/topologyUtils/graphUtils.ts";
import { batteriesType, devicesType, snrsType } from "../../../constants/types/devicesDataTypes.ts";
import useWebSocket from "react-use-websocket";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { updateEdges, updateNodes } from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import { RootState } from "../../../redux/store.ts";

export function Topology({ isSmaller }: ITopologyProps) {
    const [devices, setDevices] = useState<devicesType | null>(null);
    const [batteries, setBatteries] = useState<batteriesType | null>(null);
    const [snrsData, setSnrsData] = useState<snrsType | null>(null);
    const ws_url = "ws://localhost:8080/ws";
    const { lastJsonMessage } = useWebSocket(ws_url, {
        share: true,
        shouldReconnect: () => true,
        onError: (error) => console.error('WebSocket error:', error),
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected')
    });
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { nodes, edges } = useSelector((state: RootState) => state.topologyGroups);

    useEffect(() => {
        if (lastJsonMessage) {
            const {
                type,
                data,
                has_changed
            } = lastJsonMessage as { type: string; data: any; has_changed: boolean };

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

    const derivedData = useMemo(() => {
        if (devices && batteries && snrsData) {
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

            return { updatedNodes, edges };
        }
        return { updatedNodes: [], edges: [] };
    }, [devices, batteries, snrsData]);

    useEffect(() => {
        if (derivedData?.updatedNodes?.length && derivedData.edges?.length) {
            try {
                dispatch(updateEdges(derivedData.edges));
                dispatch(updateNodes(derivedData.updatedNodes));
            } catch (error) {
                console.error('Error in loading data:', error);
            }
        }
    }, [derivedData]);

    return (
        <div className={`${isSmaller ? 'w-[35%] h-[80%]' : 'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
            {
                nodes?.length > 0 ? <TopologyGraph />
                    : <h1 className={"h-24 w-36"}>{t('loading')}</h1>
            }
        </div>
    );
}

export default Topology;





// import { useEffect, useState } from 'react';
// import { ITopologyProps } from "./ITopologyProps";
// import TopologyGraph from "./graph/TopologyGraph";
// import { createEdgesFromData, createNodesFromData } from "../../../utils/topologyUtils/graphUtils.ts";
// import { batteriesType, devicesType, snrsType } from "../../../constants/types/devicesDataTypes.ts";
// import useWebSocket from "react-use-websocket";
// import { useTranslation } from 'react-i18next';
// import { useDispatch, useSelector } from "react-redux";
// import { updateEdges, updateNodes } from "../../../redux/TopologyGroups/topologyGroupsSlice.ts";
// import { RootState } from "../../../redux/store.ts";

// export function Topology(props: ITopologyProps) {
//     const [devices, setDevices] = useState<devicesType | null>(null);
//     const [batteries, setBatteries] = useState<batteriesType | null>(null);
//     const [snrsData, setSnrsData] = useState<snrsType | null>(null);
//     const ws_url = "ws://localhost:8080/ws";
//     const { lastJsonMessage } = useWebSocket(
//         ws_url, {
//         share: true,
//         shouldReconnect: () => true,
//         onError: (error) => console.error('WebSocket error:', error),
//         onOpen: () => console.log('WebSocket connected'),
//         onClose: () => console.log('WebSocket disconnected')
//     }
//     );
//     const { t } = useTranslation();
//     const dispatch = useDispatch();
//     const { nodes, edges } = useSelector((state: RootState) => state.topologyGroups);

//     useEffect(() => {
//         if (lastJsonMessage) {
//             try {
//                 const newData = lastJsonMessage as { type: string, data: any, has_changed: boolean };
//                 if (newData.type === 'net_data') {
//                     const {
//                         'device_list': device_list,
//                         'snr-list': snr_list
//                     } = newData.data;

//                     if (newData.has_changed) {
//                         setDevices(device_list);
//                     }

//                     setSnrsData(snr_list);
//                 } else if (newData.type === 'battery') {
//                     setBatteries(newData.data);
//                 } else {
//                     console.log('Unknown message type:', newData.type);
//                 }
//             } catch (error) {
//                 console.error('Error handling WebSocket message:', error);
//             }
//         }
//     }, [lastJsonMessage]);

//     useEffect(() => {
//         if (devices && batteries && snrsData) {
//             try {
//                 const newNodes = createNodesFromData(devices, batteries);
//                 const edges = createEdgesFromData(snrsData);

//                 const updatedNodes = newNodes.map(newNode => {
//                     // sync server data with existing nodes in redux:
//                     const existingNode = nodes.find(node => node.id === newNode.id);
//                     if (existingNode) {
//                         return {
//                             ...existingNode,
//                             data: {
//                                 ...existingNode.data,
//                                 battery: newNode.data.battery
//                             },
//                             x: existingNode.x,
//                             y: existingNode.y
//                         };
//                     }
//                     return newNode;
//                 });

//                 dispatch(updateEdges(edges));
//                 dispatch(updateNodes(updatedNodes));
//             } catch (error) {
//                 console.error('Error in loading data:', error);
//             }
//         }
//     }, [devices, batteries, snrsData]);

//     return (
//         <div className={`${props.isSmaller ? 'w-[35%] h-[80%]' :
//             'w-full h-full border border-black bg-black'} block absolute overflow-hidden`}>
//             {
//                 nodes?.length > 0 ? <TopologyGraph />
//                     : <h1 className={"h-24 w-36"}>{t('loading')}</h1>
//             }
//         </div>
//     );
// }
