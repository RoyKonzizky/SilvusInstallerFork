import { IUserEdge, IUserNode } from "@antv/graphin";
import {HullCfg} from "@antv/graphin/lib/components/Hull";

export interface ITopologyGroupsReducerState {
    nodes: IUserNode[],
    edges: IUserEdge[],
    hullOptions: HullCfg[],
    graphLayout: string
}
