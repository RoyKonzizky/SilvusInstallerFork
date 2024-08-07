import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialTopologyGroupsState } from "./initialTopologyGroupsState";
import { HullCfg } from "@antv/graphin/lib/components/Hull";
import { IUserEdge, IUserNode } from "@antv/graphin";
import {camsType} from "../../constants/types/devicesDataTypes.ts";

const topologyGroupsSlice = createSlice({
    name: 'topologyGroups',
    initialState: initialTopologyGroupsState,
    reducers: {
        updateHulls: (state, action: PayloadAction<HullCfg[]>) => {
            state.hullOptions = action.payload;
        },
        updateNodes: (state, action: PayloadAction<IUserNode[]>) => {
            state.nodes = action.payload;
        },
        updateEdges: (state, action: PayloadAction<IUserEdge[]>) => {
            state.edges = action.payload;
        },
        setGraphData(state, action: PayloadAction<{ nodes: IUserNode[], edges: IUserEdge[] }>) {
            state.nodes = action.payload.nodes;
            state.edges = action.payload.edges;
        },
        updateNodePositions(state, action: PayloadAction<{ id: string, x: number, y: number }[]>) {
            action.payload.forEach(updatedNode => {
                const nodeIndex = state.nodes.findIndex(node => node.id === updatedNode.id);
                if (nodeIndex !== -1) {
                    state.nodes[nodeIndex] = {
                        ...state.nodes[nodeIndex],
                        x: updatedNode.x,
                        y: updatedNode.y,
                    };
                }
            });
        },
        setGraphLayoutType(state, action: PayloadAction<string>) {
            state.graphLayout = action.payload;
        },
        setCameras: (state, action: PayloadAction<camsType>) => {
            state.cameras = action.payload;
        },
    },
});

export const {
    updateHulls,
    updateNodes,
    updateEdges,
    setGraphData,
    updateNodePositions,
    setGraphLayoutType,
    setCameras
} = topologyGroupsSlice.actions;

export default topologyGroupsSlice.reducer;
