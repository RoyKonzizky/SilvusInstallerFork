import {createSlice} from "@reduxjs/toolkit";
import {initialTopologyGroupsState} from "./initialTopologyGroupsState.ts";


const topologyGroupsSlice = createSlice({
    name: 'topologyGroups',
    initialState: initialTopologyGroupsState,
    reducers: {
        updateTopologyGroupsState: (state, action) => {
            state.nodes = action.payload.nodes;
            state.edges = action.payload.edges;
            state.combos = action.payload.combos;
        },
    },
});

export const { updateTopologyGroupsState } = topologyGroupsSlice.actions;
export default topologyGroupsSlice.reducer;
