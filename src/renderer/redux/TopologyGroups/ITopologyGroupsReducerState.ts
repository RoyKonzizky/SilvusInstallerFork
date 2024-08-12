import { IUserEdge, IUserNode } from "@antv/graphin";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {camsType} from "../../constants/types/devicesDataTypes.ts";

export interface ITopologyGroupsReducerState {
    nodes: IUserNode[],
    edges: IUserEdge[],
    hullOptions: HullCfg[],
    graphLayout: string,
    cameras: camsType,
}
