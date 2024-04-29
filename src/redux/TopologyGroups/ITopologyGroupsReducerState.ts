import {NodeConfig} from "@antv/g6-core/lib/types";
import {ComboConfig, EdgeConfig} from "@antv/g6";

export interface ITopologyGroupsReducerState {
    nodes: NodeConfig[],
    edges: EdgeConfig[],
    combos: ComboConfig[],
}