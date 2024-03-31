import { createSlice } from '@reduxjs/toolkit';
import {initialCollapsingState} from "./initialCollapsingState.ts";

const collapsingSlice = createSlice({
    name: 'collapsing',
    initialState: initialCollapsingState,
    reducers: {
        interactExpandingAndCollapsingButton: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        }
    },
});

export const { interactExpandingAndCollapsingButton } = collapsingSlice.actions;
export default collapsingSlice.reducer;