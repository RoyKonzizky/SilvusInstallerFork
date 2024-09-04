import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Graphin, { IUserEdge, IUserNode } from "@antv/graphin";
import { ElementPopover } from "./popover/ElementPopover.tsx";
import { graphStyle } from "../../../../utils/topologyUtils/graphUtils.ts";
import { TopologyTopBar } from "../TopologyTopBar/TopologyTopBar.tsx";
import { updateNodePositions } from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";

interface ITopologyGraph {
    nodes: IUserNode[],
    edges: IUserEdge[],
    setDraggingState: (isDragged: boolean) => void,
}

export function TopologyGraph(props: ITopologyGraph) {
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const graphRef = useRef<any>(null);
    const [doubleClickDetector, setDoubleClickDetector] = useState(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const [isTouchStarted, setIsTouchStarted] = useState(false);
    const { setDraggingState } = props;

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (!graph) return;

        graph.fitView();
    }, []);

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (!graph) return;

        const handleNodeDragStart = () => setDraggingState(true);

        const handleNodeDragEnd = () => {
            if (!isTouchStarted) return;
            const updatedNodes = graph.getNodes().map((node: IUserNode) => {
                const nodeModel = node.getModel();
                return {
                    id: nodeModel.id,
                    x: nodeModel.x,
                    y: nodeModel.y,
                };
            });

            dispatch(updateNodePositions(updatedNodes));
            setDraggingState(false);
            setIsTouchStarted(false);
        };

        const handleTouchStart = (event: any) => {
            const model = event.item.getModel();
            console.log('Touch started on node ID:', model.id);
            setDraggingState(true);
            setIsTouchStarted(true);
            setSelectedElement(null);
        };

        const handleTouchEnd = () => {
            if (!isTouchStarted) return;
            const updatedNodes = graph.getNodes().map((node: IUserNode) => {
                const nodeModel = node.getModel();
                return {
                    id: nodeModel.id,
                    x: nodeModel.x,
                    y: nodeModel.y,
                };
            });
            setDraggingState(false);
            dispatch(updateNodePositions(updatedNodes));
            setIsTouchStarted(false);
        };

        graph.on('node:dragstart', handleNodeDragStart);
        graph.on('node:dragend', handleNodeDragEnd);
        graph.on('node:touchstart', handleTouchStart);

        const canvasElement = graph.get('canvas').get('el');
        canvasElement.addEventListener('touchend', handleTouchEnd);

        return () => {
            graph.off('node:dragstart', handleNodeDragStart);
            graph.off('node:dragend', handleNodeDragEnd);
            graph.off('node:touchstart', handleTouchStart);
            canvasElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, [props.nodes, isTouchStarted]);

    const handleElementClick = (event: { item: any; }) => {
        const model = event.item.getModel();
        setSelectedElement(model);

        const graph = graphRef.current?.graph;
        if (graph) {
            const point = graph.getCanvasByPoint(model.x, model.y);
            setPopoverPosition({ x: point.x, y: point.y });
        }
    };

    useEffect(() => {
        const graph = graphRef.current?.graph;

        if (graph) {
            graph.on('node:click', handleElementClick);

            graph.on('node:touchstart', (event: any) => {
                // const model = event.item.getModel(); // console.log('Touched node ID:', model.id);

                if (timerId) { clearTimeout(timerId); }

                setDoubleClickDetector(prevState => prevState + 1);

                if (doubleClickDetector === 1){
                    setDoubleClickDetector(0);
                    handleElementClick(event);
                }else {
                    const newTimerId = setTimeout(() => {
                        setDoubleClickDetector(0);
                    }, 500);
                    setTimerId(newTimerId);
                }
            });
        }

        return () => {
            if (graph) {
                graph.off('node:click', handleElementClick);
                graph.off('node:touchstart');
            }
        };
    }, [doubleClickDetector, props.nodes, isTouchStarted]);

    const modes = {
        default: [
            'drag-node', 'drag-combo', 'drag-canvas', 'zoom-canvas',
            { type: 'click-select', onClick: handleElementClick, selectNode: true, },
            { type: 'click-select' },
        ]
    };

    return (
        <Graphin ref={graphRef} modes={modes} data={{ nodes: props.nodes, edges: props.edges }} style={graphStyle}
                 layout={{ name: 'force2', options: {} }} width={2000} height={1000}>
            {selectedElement && <ElementPopover position={popoverPosition} selectedElement={selectedElement}
                                                onClose={() => setSelectedElement(null)}/>}
            <TopologyTopBar />
        </Graphin>
    );
}
