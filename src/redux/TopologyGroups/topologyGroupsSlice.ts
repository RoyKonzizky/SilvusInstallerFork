import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialTopologyGroupsState } from "./initialTopologyGroupsState";
import {HullCfg} from "@antv/graphin/lib/components/Hull";

const topologyGroupsSlice = createSlice({
    name: 'topologyGroups',
    initialState: initialTopologyGroupsState,
    reducers: {
        updateHulls: (state, action: PayloadAction<HullCfg[]>) => {
            state.hullOptions = action.payload;
        }
    },
});

export const { updateHulls } = topologyGroupsSlice.actions;
export default topologyGroupsSlice.reducer;
