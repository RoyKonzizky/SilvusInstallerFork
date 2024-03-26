import { createSlice } from '@reduxjs/toolkit';
import {initialSettingsState} from "./initialSettingsState.ts";

const settingsSlice = createSlice({
    name: 'settings',
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

export const { updateTheSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;