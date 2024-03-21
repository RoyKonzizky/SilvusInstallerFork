import {darkTheme, GraphCanvas, GraphCanvasRef, InternalGraphEdge, InternalGraphNode} from 'reagraph';
import {useRef, useState} from "react";

const nodes = [
    {
        id: '1',
        label: '1',
    },
    {
        id: '2',
        label: '2',
    },
    {
        id: '3',
        label: '3',
    },
];

const edges = [
    {
        source: '1',
        target: '2',
        id: '1-2',
        label: '1-2',
    },
    {
        source: '3',
        target: '1',
        id: '3-1',
        label: '3-1',
    },
    {
        source: '3',
        target: '2',
        id: '3-2',
        label: '3-2',
    },
];

export function Topology() {
    const graphRef = useRef<GraphCanvasRef | null>(null);
    const [contextMenuData, setContextMenuData] =
        useState<InternalGraphNode | null | InternalGraphEdge>(null);

    const openContextMenu = (data: InternalGraphNode | InternalGraphEdge) => {
        setContextMenuData(data);
    };

    const closeContextMenu = () => {
        setContextMenuData(null);
    };

    const customTheme = {
        ...darkTheme,
        canvas: {
            background: 0x000000,
            fog: 0x000000,
        },
    };

    return (
        <div className="block absolute w-full h-full border border-black bg-black overflow-hidden">
            <GraphCanvas
                theme={customTheme}
                ref={graphRef}
                nodes={nodes}
                edges={edges}
                draggable
                labelType={'all'}
                edgeArrowPosition={'none'}
                onNodeClick={node => {
                    openContextMenu(node);
                }}
                onEdgeClick={edge => {
                    openContextMenu(edge);
                }}
            />
            {contextMenuData && (
                <div className="absolute bg-white w-96 h-96 border border-blue-500 rounded p-5 text-center">
                    <h1 className={'text-black'}>{'node id: ' + contextMenuData.id}</h1>
                    <h1 className={'text-black'}>{'node label: ' + contextMenuData.label}</h1>
                    <button
                        className={'bg-black absolute bottom-0 mb-5 left-[20%] w-56 text-2xl border-2 border-gray-700 ' +
                            'py-4 px-6 rounded-lg text-white font-semibold inline-block cursor-pointer ' +
                            'transition duration-300 ease-in-out transform hover:shadow-md hover:-translate-y-2'}
                        onClick={closeContextMenu}>
                        Close Menu
                    </button>
                </div>
            )}
        </div>
    );
}
