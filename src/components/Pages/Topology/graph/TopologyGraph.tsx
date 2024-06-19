import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import Hull from "@antv/graphin/es/components/Hull";
import {ElementPopover} from "./popover/ElementPopover.tsx";
import {RootState} from "../../../../redux/store.ts";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {graphStyle} from "../../../../utils/topologyUtils/graphUtils.ts";
import {TopologyTopBar} from "../topBar/TopologyTopBar.tsx";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] =
        useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] =
        useState<{ x: number, y: number }>({x: 0, y: 0});
    const hullsFromSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const [hullOptions, setHullOptions] =
        useState<HullCfg[]>(hullsFromSelector ?? []);
    const graphRef = useRef<any>(null);
    const [showHulls, setShowHulls] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowHulls(true);
        }, 3);
        setHullOptions(hullsFromSelector);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        setHullOptions(hullsFromSelector);
    }, [hullsFromSelector]);


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
                type: 'click-select', onClick: handleElementClick, selectNode: true, selectEdge: true,
            },
            {
                type: 'click-select',
            },
        ]
    };

    return (
        <Graphin ref={graphRef} modes={modes} data={props.graphData} style={graphStyle}>
            {selectedElement && (<ElementPopover onClose={() => setSelectedElement(null)}
                                                 position={popoverPosition} selectedElement={selectedElement}/>)}
            {showHulls && (hullOptions.length > 0 &&
                    hullOptions.every(hull => hull.members && hull.members.length > 0)) &&
                (<Hull options={hullOptions}/>)}
            <TopologyTopBar graphData={props.graphData}/>
        </Graphin>
    );
}
