import {TableModal} from "./TopologyTable/TableModal.tsx";
import {RefObject} from "react";
import {NodeConfig} from "@antv/g6-core/lib/types";
import {ComboConfig, EdgeConfig} from "@antv/g6";

interface ITopologyGraph {
    container: RefObject<HTMLDivElement>,
    graphData: {nodes: NodeConfig[], edges: EdgeConfig[], combos: ComboConfig[]},
}

export function TopologyGraph(props: ITopologyGraph) {

    return (
        <div ref={props.container} className={'relative w-full h-full bg-black text-white'}>
            <TableModal graphData={props.graphData}/>
        </div>
    );
}