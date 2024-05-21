import {combineReducers, configureStore} from '@reduxjs/toolkit';
import settingsReducer from './Settings/settlingsSlice.ts';
import presetsReducer from './Presets/presetsSlice.ts';
import collapsingReducer from './Collapsing/collapsingSlice';
import topologyGroupsSlice from "./TopologyGroups/topologyGroupsSlice.ts";

const rootReducer = combineReducers({
    settings: settingsReducer,
    presets: presetsReducer,
    collapsing: collapsingReducer,
    topologyGroups: topologyGroupsSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;
