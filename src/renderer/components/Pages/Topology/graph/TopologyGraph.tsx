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
    setDraggingState: (isDragged: boolean) => void
}

export function TopologyGraph(props: ITopologyGraph) {
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const graphRef = useRef<any>(null);
    const [doubleClickDetector, setDoubleClickDetector] = useState(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

    const { setDraggingState } = props;

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (graph) {
            const handleNodePositionChange = () => {
                const updatedNodes = graph.getNodes().map((node: any) => {
                    const model = node.getModel();
                    const canvasPosition = graph.getCanvasByPoint(model.x, model.y);
                    return {
                        id: model.id,
                        x: Number(canvasPosition.x.toFixed(3)),
                        y: Number(canvasPosition.y.toFixed(3))
                    };
                });
                dispatch(updateNodePositions(updatedNodes));
                setDraggingState(false);
            };

            graph.on('node:dragstart', () => setDraggingState(true));
            graph.on('node:dragend', handleNodePositionChange);

            return () => {
                graph.off('node:dragstart', () => setDraggingState(true));
                graph.off('node:dragend', handleNodePositionChange);
            };
        }
    }, []);

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
                const model = event.item.getModel();
                console.log('Touched node ID:', model.id);

                if (timerId) {
                    clearTimeout(timerId);
                }

                setDoubleClickDetector(prevState => prevState + 1);

                if (doubleClickDetector === 1){
                    setDoubleClickDetector(0);
                    handleElementClick(event);
                }else {
                    const newTimerId = setTimeout(() => {
                        setDoubleClickDetector(0);
                    }, 200);
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
    }, [doubleClickDetector]);

    const modes = {
        default: [
            'drag-node', 'drag-combo', 'drag-canvas', 'zoom-canvas',
            { type: 'click-select', onClick: handleElementClick, selectNode: true, },
            { type: 'click-select' },
        ]
    };

    return (
        <Graphin
            ref={graphRef}
            modes={modes}
            data={{ nodes: props.nodes, edges: props.edges }}
            style={graphStyle}
            layout={{ name: 'force2', options: {} }}
            width={2000}
            height={1000}
        >
            {selectedElement &&
                <ElementPopover
                    position={popoverPosition}
                    selectedElement={selectedElement}
                    onClose={() => setSelectedElement(null)}
                />
            }
            <TopologyTopBar />
        </Graphin>
    );
}
