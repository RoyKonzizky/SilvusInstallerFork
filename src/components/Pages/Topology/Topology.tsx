import { useState, useEffect, useRef } from 'react';
import { initializeGraph, generateRandomData } from '../../../utils/topologyUtils/graphSetup/graphSetup.ts';
import { Graph } from '@antv/g6';
import HyperModal from "react-hyper-modal";
import { SettingsTable } from './SettingsTable';
import settingsIcon from "../../../assets/settingsIconTopology.svg";

export function Topology() {
    const container = useRef<HTMLDivElement>(null);
    let graph: Graph | null = null;
    const graphData = generateRandomData();
    const [size, setSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [modalState, setModalState] = useState(false);

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

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
            <button className={"text-black absolute z-50 left-1 top-1 w-20 h-24 rounded"} onClick={openModal}>
                <img className={"bg-white rounded-full"} src={settingsIcon} alt={"settings"}/>
            </button>
            <HyperModal isOpen={modalState} requestClose={closeModal}>
                <SettingsTable groups={["Group1", "Group2"]} nodes={graphData.nodes} />
            </HyperModal>
        </div>
    );
}
