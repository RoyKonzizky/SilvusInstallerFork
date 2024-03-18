import {combineReducers, configureStore} from '@reduxjs/toolkit';
import collapsingReducer from './Collapsing/collapsingSlice';

const rootReducer = combineReducers({
    collapsing: collapsingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;