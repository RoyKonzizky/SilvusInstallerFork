import {TableModal} from "./topologyTable/TableModal.tsx";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import {Combo} from "@antv/graphin/es/typings/type";
import {useRef, useState} from "react";
import {ElementPopover} from "./ElementPopover.tsx";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[], combos: Combo[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>();
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const graphRef = useRef<any>(null);

    const handleElementClick = (event: { item: any; }) => {
        const model = event.item.getModel();
        setSelectedElement(model);

        const graph = graphRef.current?.graph;
        if (graph) {
            const point = graph.getCanvasByPoint(model.x, model.y);
            setPopoverPosition({x: point.x, y: point.y});
        }
    };

    const modes = {
        default: [
            'drag-node', 'drag-canvas', 'zoom-canvas', 'drag-combo',
            {
                type: 'click-select',
                onClick: handleElementClick,
            },
            {
                type: 'click-select',
                selectNode: true,
                selectEdge: true,
            },
        ]
    };

    return (
        <Graphin ref={graphRef} style={{background: "black", width: '100%', height: '100%', color: "white"}}
                 modes={modes} data={props.graphData}>
            <TableModal graphData={props.graphData}/>
            {selectedElement && (
                <ElementPopover onClose={() => setSelectedElement(null)}
                                selectedElement={selectedElement} position={popoverPosition}
                />
            )}
        </Graphin>
    );
}
