import { createSlice } from '@reduxjs/toolkit';
import {initialSettingsState} from "./initialSettingsState.ts";

const resultsSlice = createSlice({
    name: 'results',
    initialState: initialSettingsState,
    reducers: {
        updateTheSettingsState: (state, action) => {
            state.frequency = action.payload.frequency;
            state.bandwidth = action.payload.bandwidth;
            state.networkId = action.payload.networkId;
            state.totalTransitPower = action.payload.totalTransitPower;
        }
    },
});

export const { updateTheSettingsState } = resultsSlice.actions;
export default resultsSlice.reducer;