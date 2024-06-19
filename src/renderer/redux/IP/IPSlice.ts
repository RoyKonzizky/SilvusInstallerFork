import { createSlice } from '@reduxjs/toolkit';
import {initialIpState} from "./initialIpState.ts";

const ipSlice = createSlice({
    name: 'ip',
    initialState: initialIpState,
    reducers: {
        setIp: (state, action) => {
            state.ip_address = action.payload;
        }
    },
});

export const { setIp } = ipSlice.actions;
export default ipSlice.reducer;