import {useEffect, useRef, useState} from 'react';
import {generateData, initializeGraph} from '../../../../utils/topologyUtils/graphSetup/graphSetup.ts';
import {Graph} from '@antv/g6';
import {ITopologyProps} from "./ITopologyProps.ts";
import {TopologyGraph} from "../TopologyGraph.tsx";

export function Topology(props: ITopologyProps) {
    const container = useRef<HTMLDivElement>(null);
    let graph: Graph | null = null;
    const graphData = generateData();
    graphData.combos = [];
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const handleResize = () => {
        if (container.current) {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (size.width > 0 && size.height > 0) {
            if (!graph) {
                graph = initializeGraph(container.current!, size.width, size.height);

                graph.data(graphData);
                graph.render();

                return () => {
                    if (graph) {
                        graph.destroy();
                        graph = null;
                    }
                };
            } else {
                graph.changeSize(size.width, size.height);
            }
        }
    }, [size]);

    return (
        <div className={`${props.isSmaller ? "w-[35%] h-[35%]" :
            "w-full h-full border border-black bg-black"} block absolute overflow-hidden`}>
            <TopologyGraph container={container} graphData={graphData}/>
        </div>
    );
}
