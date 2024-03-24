import {combineReducers, configureStore} from '@reduxjs/toolkit';
import settingsReducer from './Settings/settlingsSlice.ts';

const rootReducer = combineReducers({
    settings: settingsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;