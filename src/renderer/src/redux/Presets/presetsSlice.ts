import { createSlice } from '@reduxjs/toolkit';
import {initialPresetsState} from "./initialPresetsState.ts";

const presetsSlice = createSlice({
    name: 'presets',
    initialState: initialPresetsState,
    reducers: {
        changeChosenSpectrum: (state, action) => {
            state.chosenSpectrum = action.payload.chosenSpectrum;
        }
    },
});

export const { changeChosenSpectrum } = presetsSlice.actions;
export default presetsSlice.reducer;