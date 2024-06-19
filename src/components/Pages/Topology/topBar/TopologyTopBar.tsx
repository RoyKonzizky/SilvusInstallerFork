import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";
import { IUserEdge, IUserNode } from "@antv/graphin";

interface ITopologyTopBar {
    graphData: { nodes: IUserNode[], edges: IUserEdge[] };
}

export function TopologyTopBar(props: ITopologyTopBar) {
    return (
        <div className={'flex flex-row absolute top-0 left-0 z-50'}>
            <TableModal graphData={props.graphData} />
            <LegendSnr />
        </div>
    );
}
