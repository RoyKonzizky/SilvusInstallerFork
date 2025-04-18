import { ITopologyGroupsReducerState } from "./ITopologyGroupsReducerState.ts";

export const initialTopologyGroupsState: ITopologyGroupsReducerState = {
    nodes: [],
    edges: [],
    hullOptions: [],
    graphLayout: 'dagre',
    cameras: {message: '', data: []},
    sizeInterval: 1,
};
