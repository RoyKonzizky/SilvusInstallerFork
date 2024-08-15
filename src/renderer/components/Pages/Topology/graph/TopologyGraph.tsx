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
                        x: canvasPosition.x,
                        y: canvasPosition.y
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
                handleElementClick(event);
            });
        }

        return () => {
            if (graph) {
                graph.off('node:click', handleElementClick);
                graph.off('node:touchstart');
            }
        };
    }, []);

    useEffect(() => {
        const graph = graphRef.current?.graph;

        const updatedEdges = props.edges.map(edge => {
            const labelValue = Number(edge.style?.label?.value);
            let edgeColor;

            if (labelValue < 20) {
                edgeColor = 'red';
            } else if (labelValue > 30) {
                edgeColor = 'green';
            } else {
                edgeColor = 'yellow';
            }

            return {
                ...edge,
                style: {
                    ...edge.style,
                    label: {
                        ...edge.style?.label,
                        value: `${labelValue}`,
                        fill: edgeColor,
                        fontSize: 30,
                    },
                    keyshape: {
                        ...edge.style?.keyshape,
                        endArrow: {
                            path: '',
                        },
                        stroke: edgeColor,
                        lineWidth: 6,
                    },
                },
            };
        });

        if (graph) {
            graph.changeData({
                ...graph.save(),
                edges: updatedEdges,
            });
        }
    }, [props.edges]);

    useEffect(() => {
        const graph = graphRef.current?.graph;

        if (graph) {
            props.nodes.forEach(node => {
                const updatedNode = {
                    ...node,
                    id: node.id,
                    style: {
                        label: {
                            value: node.style?.label?.value || '',
                            fill: '#FFFFFF',
                        },
                        keyshape: {
                            fill: '#1fb639',
                            stroke: '#1fb639',
                            fillOpacity: 1,
                            size: 50,
                        },
                    },
                    data: {
                        battery: node.data.battery.toString(),
                        statuses: node.data.statuses,
                        ip: node.data.ip,
                    },
                };

                graph.updateItem(node.id, updatedNode);
            });
        }
    }, [props.nodes]);

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
                onClose={() => setSelectedElement(null)} />}
            <TopologyTopBar />
        </Graphin>
    );
}
