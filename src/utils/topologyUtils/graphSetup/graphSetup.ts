import G6, {EdgeConfig, Graph, Item} from '@antv/g6';
import {NodeConfig} from '@antv/g6-core/lib/types';
import {tooltipInit} from "../tooltipSetup.ts";
import {getDefaultEdgeConfig, getDefaultNodeConfig} from "./graphElementSetup.ts";

export function initializeGraph(container: HTMLDivElement, width: number, height: number): Graph {
    const graph = new G6.Graph({
        container,
        width,
        height,
        modes: {
            default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'click-select'],
        },
        defaultNode: getDefaultNodeConfig(),
        defaultEdge: getDefaultEdgeConfig(),
        fitCenter: true,
        fitView: true,
    });

    graph.addPlugin(tooltipInit(graph));

    graph.on('node:click', (e) => {
        const item = e.item;
        console.log('Clicked Node:', item?.getModel().id);
        graph?.setAutoPaint(false);
        graph?.getNodes().forEach((node) => {
            graph?.setItemState(node, 'selected', false);
        });
        graph?.setItemState(item as Item, 'selected', true);
        graph?.setAutoPaint(true);
    });

    graph.on('edge:click', (e) => {
        const item = e.item;
        console.log('Clicked Edge:', item?.getModel().id);
        graph?.setAutoPaint(false);
        graph?.getEdges().forEach((edge) => {
            graph?.setItemState(edge, 'selected', false);
        });
        graph?.setItemState(item as Item, 'selected', true);
        graph?.setAutoPaint(true);
    });

    return graph;
}

export function generateRandomData(nodeCount: number): { nodes: NodeConfig[], edges: EdgeConfig[] } {
    const data = {
        nodes: [] as NodeConfig[],
        edges: [] as EdgeConfig[],
    };

    for (let i = 0; i < nodeCount; i++) {
        data.nodes.push({
            id: `node-${i}`,
            x: Math.random() * 800,
            y: Math.random() * 600,
            label: `Node-${i}`,
        });
    }

    for (let i = 0; i < data.nodes.length; i++) {
        const source = data.nodes[i].id;
        const target = data.nodes[Math.floor(Math.random() * data.nodes.length)].id;
        const labelValue = Math.floor(Math.random() * 35);
        let color;
        if (labelValue < 10) {
            color = '#f00';
        } else if (labelValue > 30) {
            color = '#17a617';
        } else {
            color = '#deb600';
        }

        data.edges.push({
            id: `edge-${i}`,
            source,
            target,
            label: `${labelValue}`,
            style: {
                stroke: color,
                lineWidth: 6,
            },
        });
    }

    return data;
}
