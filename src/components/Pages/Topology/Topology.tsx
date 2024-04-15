import { useEffect, useRef, useState } from 'react';
import {initializeGraph, generateRandomData} from '../../../utils/topologyUtils/graphSetup/graphSetup.ts';
import {Graph} from '@antv/g6';

export function Topology() {
    const container = useRef<HTMLDivElement>(null);
    let graph: Graph | null = null;
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            if (container.current) {
                setSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
        };

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

                const data = generateRandomData(25);

                graph.data(data);
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

    return <div ref={container} className={'w-full h-full bg-black text-white'} />;
}
