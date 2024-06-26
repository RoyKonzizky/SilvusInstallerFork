import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialTopologyGroupsState } from "./initialTopologyGroupsState";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {IUserEdge, IUserNode} from "@antv/graphin";

const topologyGroupsSlice = createSlice({
    name: 'topologyGroups',
    initialState: initialTopologyGroupsState,
    reducers: {
        updateHulls: (state, action: PayloadAction<HullCfg[]>) => {
            state.hullOptions = action.payload;
        },
        updateNodes: (state, action: PayloadAction<IUserNode[]>) => {
            state.nodes = action.payload;
        },
        updateEdges: (state, action: PayloadAction<IUserEdge[]>) => {
            state.edges = action.payload;
        },
    },
});

export const { updateHulls, updateNodes,
    updateEdges } = topologyGroupsSlice.actions;
export default topologyGroupsSlice.reducer;
