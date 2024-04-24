import { useRef, useState, useEffect } from 'react';
import { initializeGraph, generateData } from '../../../utils/topologyUtils/graphSetup/graphSetup.ts';
import { Graph } from '@antv/g6';
import {TableModal} from "./TableModal.tsx";

export function Topology() {
    const container = useRef<HTMLDivElement>(null);
    let graph: Graph | null = null;
    const graphData = generateData();
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
        <div ref={container} className={'relative w-full h-full bg-black text-white'}>
            <TableModal graphData={graphData} />
        </div>
    );
}
