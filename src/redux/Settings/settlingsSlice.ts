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
        },
        setFrequency: (state, action) => {
            state.frequency = action.payload;
        },
        setBandwidth: (state, action) => {
            state.bandwidth = action.payload;
        },
        setNetworkId: (state, action) => {
            state.networkId = action.payload;
        },
        setTotalTransitPower: (state, action) => {
            state.totalTransitPower = action.payload;
        }
    },
});

export const { updateTheSettingsState, setFrequency, setBandwidth, setNetworkId, setTotalTransitPower} = settingsSlice.actions;
export default settingsSlice.reducer;