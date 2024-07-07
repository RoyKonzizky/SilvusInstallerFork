import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import Hull from "@antv/graphin/es/components/Hull";
import {ElementPopover} from "./popover/ElementPopover.tsx";
import {RootState} from "../../../../redux/store.ts";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {graphStyle} from "../../../../utils/topologyUtils/graphUtils.ts";
import {TopologyTopBar} from "../TopologyTopBar/TopologyTopBar.tsx";

export function TopologyGraph() {
    const [selectedElement, setSelectedElement] =
        useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] =
        useState<{ x: number, y: number }>({x: 0, y: 0});
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [hullOptions, setHullOptions] =
        useState<HullCfg[]>(selector.hullOptions ?? []);
    const graphRef = useRef<any>(null);
    const [showHulls, setShowHulls] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowHulls(true);
        }, 3);
        setHullOptions(selector.hullOptions);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        setHullOptions(selector.hullOptions.filter((value) => value.members.length > 0));
    }, [selector.hullOptions]);

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
            {type: 'click-select', onClick: handleElementClick, selectNode: true, selectEdge: true,},
            {type: 'click-select',},
        ]
    };

    return (
        <Graphin ref={graphRef} modes={modes} data={{nodes: selector.nodes, edges: selector.edges}} style={graphStyle}>
            {selectedElement && (<ElementPopover onClose={() => setSelectedElement(null)}
                                                 position={popoverPosition} selectedElement={selectedElement}/>)}
            {showHulls && (hullOptions.length > 0 &&
                    hullOptions.every(hull => hull.members && hull.members.length > 0)) &&
                (<Hull options={hullOptions}/>)}
            <TopologyTopBar/>
        </Graphin>
    );
}

// graphRef.graph.updateItem()