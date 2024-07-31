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
    const hullsSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const edgesSelector = useSelector((state: RootState) => state.topologyGroups.edges);
    const [hulls, setHulls] = useState<HullCfg[]>([]);
    const graphRef = useRef<any>(null);
    const [showHulls, setShowHulls] = useState(false);

    useEffect(() => {
        const filteredHulls = hullsSelector.filter((value) => value.members.length > 0);

        const timeoutId = setTimeout(() => {
            setShowHulls(true);
        }, 3);
        setHulls(filteredHulls);
        return () => clearTimeout(timeoutId);
    }, [hullsSelector]);

    useEffect(() => {
        setShowHulls(false);
        const timeoutId = setTimeout(() => {
            setShowHulls(true);
        }, 3);
        setHulls(hullsSelector);
        return () => clearTimeout(timeoutId);
    }, [hullsSelector]);

    useEffect(() => {
        setHulls(hullsSelector.filter((value) => value.members.length > 0));
    }, [hullsSelector]);

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
        <Graphin ref={graphRef} modes={modes} data={{ nodes: nodesSelector, edges: edgesSelector }} style={graphStyle}
                 layout={{ name: 'dagre', options: { } }}>
            {selectedElement && (<ElementPopover onClose={() => setSelectedElement(null)}
                                                 position={popoverPosition} selectedElement={selectedElement}/>)}
            {showHulls && hulls.length > 0 && (<Hull options={hulls} />)}
            <TopologyTopBar />
        </Graphin>
    );
}
