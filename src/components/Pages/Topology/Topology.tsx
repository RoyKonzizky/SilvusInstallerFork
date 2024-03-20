import {darkTheme, GraphCanvas, GraphCanvasRef, InternalGraphEdge, InternalGraphNode} from 'reagraph';
import {CSSProperties, useRef, useState} from "react";
import "./Topology.css";

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


    const styleForContext: CSSProperties | undefined = {
        position: "absolute",
        background: 'white',
        width: 350,
        height: 350,
        border: 'solid 1px blue',
        borderRadius: 2,
        padding: 5,
        textAlign: 'center',
        top: 0,
        left: 0,
    };

    const customTheme = {
        ...darkTheme,
        canvas: {
            background: 0x000000,
            fog: 0x000000,
        },
    };

    return (
        <div className={'wrapper'}>
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
                <div style={styleForContext}>
                    <h1 className={'dataHeader'}>{'node id: ' + contextMenuData.id}</h1>
                    <h1 className={'dataHeader'}>{'node label: ' + contextMenuData.label}</h1>
                    <button className={'menuCloseButton'} onClick={closeContextMenu}>Close Menu</button>
                </div>
            )}
        </div>
    );
}
