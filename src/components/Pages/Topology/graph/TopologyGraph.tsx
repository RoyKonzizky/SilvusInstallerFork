import {useRef, useState} from "react";
import {useSelector} from "react-redux";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import {Combo} from "@antv/graphin/es/typings/type";
import Hull from "@antv/graphin/es/components/Hull";
import {TableModal} from "./topologyTable/TableModal";
import {ElementPopover} from "./ElementPopover";
import {RootState} from "../../../../redux/store.ts";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {graphStyle} from "../../../../utils/topologyUtils/graphSetup.ts";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[], combos: Combo[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] =
        useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] =
        useState<{ x: number, y: number }>({x: 0, y: 0});
    const hullOptions: HullCfg[] = useSelector((state: RootState) => state.topologyGroups.hullOptions);
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
        <Graphin ref={graphRef} modes={modes} data={props.graphData} style={graphStyle}>
            <TableModal graphData={props.graphData}/>
            {selectedElement && (<ElementPopover onClose={() => setSelectedElement(null)}
                                                 position={popoverPosition} selectedElement={selectedElement}/>)}
            {(hullOptions.length > 0 && hullOptions.every(hull => hull.members && hull.members.length > 0)) &&
                (<Hull options={hullOptions}/>)}
        </Graphin>
    );
}
