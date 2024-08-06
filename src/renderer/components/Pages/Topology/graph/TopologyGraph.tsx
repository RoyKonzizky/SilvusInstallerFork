import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import {ElementPopover} from "./popover/ElementPopover.tsx";
import {RootState} from "../../../../redux/store.ts";
import {graphStyle} from "../../../../utils/topologyUtils/graphUtils.ts";
import {TopologyTopBar} from "../TopologyTopBar/TopologyTopBar.tsx";
import {updateNodePositions} from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";

interface ITopologyGraph {
    edges: IUserEdge[]
}

export function TopologyGraph(props: ITopologyGraph) {
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const graphRef = useRef<any>(null);
    // const graphLayoutTypeSelector = useSelector((state: RootState) => state.topologyGroups.graphLayout);
    // const [graphKey, setGraphKey] = useState(0);
    // const [graphLayout, setGraphLayout] = useState<any>({ name: 'dagre', options: {} });

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
            };

            graph.on('node:dragend', handleNodePositionChange);

            return () => {
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
            setPopoverPosition({x: point.x, y: point.y});
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

            // // Alternatively, handling touch events on canvas
            // graph.on('canvas:touchstart', (event) => {
            //     const { x, y } = event;
            //     const point = graph.getPointByClient(x, y);
            //     const nodes = graph.getNodes();
            //
            //     nodes.forEach((node) => {
            //         const model = node.getModel();
            //         if (model.x === point.x && model.y === point.y) {
            //             console.log('Touched node ID:', model.id);
            //         }
            //     });
            // });
        }

        return () => {
            if (graph) {
                graph.off('node:click', handleElementClick);
                graph.off('node:touchstart');
                // graph.off('canvas:touchstart');
            }
        };
    }, []);

    useEffect(() => {
        const graph = graphRef.current.graph;

        const updatedEdges = props.edges.map(edge => {
            const labelValue = Number(edge.style?.label?.value);
            // console.log(labelValue);// console.log('this edge is in for: ', edge);
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

        graph.changeData({
            ...graph.save(),
            edges: updatedEdges,
        });
    }, [props.edges]);

    const modes = {
        default: [
            'drag-node', 'drag-canvas', 'zoom-canvas', 'drag-combo',
            {type: 'click-select', onClick: handleElementClick, selectNode: true, selectEdge: true,},
            {type: 'click-select',},
        ]
    };

    return (
        <Graphin ref={graphRef} modes={modes} data={{nodes: nodesSelector, edges: props.edges}}
                 style={graphStyle} layout={{name: 'dagre', options: {}}/*graphLayout*/}>
            {selectedElement && <ElementPopover position={popoverPosition} selectedElement={selectedElement}
                                                onClose={() => setSelectedElement(null)}/>}
            <TopologyTopBar/>
        </Graphin>
    );
}
