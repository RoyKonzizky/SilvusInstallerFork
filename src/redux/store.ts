import {combineReducers, configureStore} from '@reduxjs/toolkit';
import settingsReducer from './Settings/settlingsSlice.ts';
import presetsReducer from './Presets/presetsSlice.ts';

const rootReducer = combineReducers({
    settings: settingsReducer,
    presets: presetsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;