import { ITopologyGroupsReducerState } from "./ITopologyGroupsReducerState.ts";

const initialHull = {id: "group1", members: []}

export const initialTopologyGroupsState: ITopologyGroupsReducerState = {
    nodes: [],
    edges: [],
    hullOptions: [initialHull],
    graphLayout: 'dagre'
};
