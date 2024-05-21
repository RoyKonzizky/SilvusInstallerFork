import { IUserEdge, IUserNode } from "@antv/graphin";
import { Combo } from "@antv/graphin/es/typings/type";

export interface ITopologyGroupsReducerState {
    nodes: IUserNode[],
    edges: IUserEdge[],
    combos: Combo[],
    hulls: any[],
}
