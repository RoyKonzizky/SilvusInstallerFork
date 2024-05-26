import {useEffect, useRef, useState} from 'react';
import {ITopologyProps} from "./ITopologyProps";
import {TopologyGraph} from "./graph/TopologyGraph";
import {generateData} from "../../../utils/topologyUtils/graphSetup";

export function Topology(props: ITopologyProps) {
    const [graphData, setGraphData] = useState(generateData());
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://your-websocket-server-url');

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGraphData(data);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    return (
        <div className={`${props.isSmaller ? "w-[35%] h-[35%]" :
            "w-full h-full border border-black bg-black"} block absolute overflow-hidden`}>
            <TopologyGraph graphData={graphData}/>
        </div>
    );
}
