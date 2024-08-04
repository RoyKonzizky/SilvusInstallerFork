import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Graphin, { IUserEdge, IUserNode } from "@antv/graphin";
import { ElementPopover } from "./popover/ElementPopover.tsx";
import { RootState } from "../../../../redux/store.ts";
import { graphStyle } from "../../../../utils/topologyUtils/graphUtils.ts";
import { TopologyTopBar } from "../TopologyTopBar/TopologyTopBar.tsx";
import { updateNodePositions } from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";

export function TopologyGraph() {
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const edgesSelector = useSelector((state: RootState) => state.topologyGroups.edges);
    const graphLayoutTypeSelector = useSelector((state: RootState) => state.topologyGroups.graphLayout);
    const [graphLayout, setGraphLayout] = useState<any>({ name: 'dagre', options: {} });
    const graphRef = useRef<any>(null);

    // const layout = graphLayoutType === "dagre" ? { name: 'dagre', options: {} } : {
    //     type: graphLayoutType, // You can try other layouts like 'force', 'grid', 'circular', 'concentric'
    //     preventOverlap: true,
    //     linkDistance: 150,
    //     nodeStrength: -30,
    //     edgeStrength: 0.1,
    // };

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
            setPopoverPosition({ x: point.x, y: point.y });
        }
    };

    useEffect(() => {
        const layout = graphLayoutTypeSelector === "dagre" ?
            { name: 'dagre', options: {} }
            : {
                type: graphLayoutTypeSelector, // 'force', 'grid', 'circular', 'concentric'
                preventOverlap: true,
                linkDistance: 150,
                nodeStrength: -30,
                edgeStrength: 0.1,
            };
        setGraphLayout(layout);
    }, [graphLayoutTypeSelector]);

    const modes = {
        default: [
            'drag-node', 'drag-canvas', 'zoom-canvas', 'drag-combo',
            { type: 'click-select', onClick: handleElementClick, selectNode: true, selectEdge: true },
            { type: 'click-select' },
        ]
    };

    return (
        <Graphin
            ref={graphRef}
            modes={modes}
            data={{ nodes: nodesSelector, edges: edgesSelector }}
            style={graphStyle}
            layout={graphLayout}
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

export default TopologyGraph;