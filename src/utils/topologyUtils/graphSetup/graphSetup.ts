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
        layout: {
            type: 'mds',
            preventOverlap: true
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

export function generateRandomData(): { nodes: NodeConfig[], edges: EdgeConfig[] } {
    const data = {
        nodes: [
            {id: 'node-0', label: 'Node-0',},
            {id: 'node-1', label: 'Node-1',},
            {id: 'node-2', label: 'Node-2',},
            {id: 'node-3', label: 'Node-3',},
            {id: 'node-4', label: 'Node-4',},
            {id: 'node-5', label: 'Node-5',},
            {id: 'node-6', label: 'Node-6',},
            {id: 'node-7', label: 'Node-7',},
            {id: 'node-8', label: 'Node-8',},
            {id: 'node-9', label: 'Node-9',},
            {id: 'node-10', label: 'Node-10',},
            {id: 'node-11', label: 'Node-11',},
            {id: 'node-12', label: 'Node-12',},
            {id: 'node-13', label: 'Node-13',},
            {id: 'node-14', label: 'Node-14',},
            {id: 'node-15', label: 'Node-15',},
            {id: 'node-16', label: 'Node-16',},
            {id: 'node-17', label: 'Node-17',},
            {id: 'node-18', label: 'Node-18',},
            {id: 'node-19', label: 'Node-19',},
            {id: 'node-20', label: 'Node-20',},
            {id: 'node-21', label: 'Node-21',},
            {id: 'node-22', label: 'Node-22',},
            {id: 'node-23', label: 'Node-23',},
            {id: 'node-24', label: 'Node-24',}] as NodeConfig[],
        edges: [{id: 'edge-0', source: 'node-0', target: 'node-21', label: '8'},
            {id: 'edge-1', source: 'node-1', target: 'node-2', label: '18'},
            {id: 'edge-2', source: 'node-2', target: 'node-3', label: '6'},
            {id: 'edge-3', source: 'node-3', target: 'node-20', label: '1'},
            {id: 'edge-4', source: 'node-4', target: 'node-23', label: '12'},
            {id: 'edge-5', source: 'node-5', target: 'node-5', label: '33'},
            {id: 'edge-6', source: 'node-6', target: 'node-11', label: '31'},
            {id: 'edge-7', source: 'node-7', target: 'node-15', label: '26'},
            {id: 'edge-8', source: 'node-8', target: 'node-18', label: '3'},
            {id: 'edge-9', source: 'node-9', target: 'node-17', label: '9'},
            {id: 'edge-10', source: 'node-10', target: 'node-11', label: '27'},
            {id: 'edge-11', source: 'node-11', target: 'node-12', label: '26'},
            {id: 'edge-12', source: 'node-12', target: 'node-24', label: '33'},
            {id: 'edge-13', source: 'node-13', target: 'node-22', label: '4'},
            {id: 'edge-14', source: 'node-14', target: 'node-10', label: '4'},
            {id: 'edge-15', source: 'node-15', target: 'node-5', label: '16'},
            {id: 'edge-16', source: 'node-16', target: 'node-17', label: '28'},
            {id: 'edge-17', source: 'node-17', target: 'node-9', label: '3'},
            {id: 'edge-18', source: 'node-18', target: 'node-10', label: '20'},
            {id: 'edge-19', source: 'node-19', target: 'node-24', label: '31'},
            {id: 'edge-20', source: 'node-20', target: 'node-5', label: '21'},
            {id: 'edge-21', source: 'node-21', target: 'node-1', label: '34'},
            {id: 'edge-22', source: 'node-22', target: 'node-11', label: '33'},
            {id: 'edge-23', source: 'node-23', target: 'node-10', label: '28'},
            {id: 'edge-24', source: 'node-24', target: 'node-1', label: '32'},
            {id: 'edge-25', source: 'node-0', target: 'node-8', label: '2'},
            {id: 'edge-26', source: 'node-1', target: 'node-16', label: '25'},
            {id: 'edge-27', source: 'node-2', target: 'node-4', label: '13'},
            {id: 'edge-28', source: 'node-3', target: 'node-15', label: '26'},
            {id: 'edge-29', source: 'node-4', target: 'node-0', label: '23'},
            {id: 'edge-30', source: 'node-5', target: 'node-16', label: '1'},
            {id: 'edge-31', source: 'node-6', target: 'node-23', label: '1'},
            {id: 'edge-32', source: 'node-7', target: 'node-16', label: '16'},
            {id: 'edge-33', source: 'node-8', target: 'node-17', label: '10'},
            {id: 'edge-34', source: 'node-9', target: 'node-10', label: '15'},
            {id: 'edge-35', source: 'node-10', target: 'node-13', label: '30'},
            {id: 'edge-36', source: 'node-11', target: 'node-21', label: '4'},
            {id: 'edge-37', source: 'node-12', target: 'node-20', label: '28'},
            {id: 'edge-38', source: 'node-13', target: 'node-13', label: '16'},
            {id: 'edge-39', source: 'node-14', target: 'node-0', label: '8'},
            {id: 'edge-40', source: 'node-15', target: 'node-1', label: '8'},
            {id: 'edge-41', source: 'node-16', target: 'node-22', label: '12'},
            {id: 'edge-42', source: 'node-17', target: 'node-8', label: '0'},
            {id: 'edge-43', source: 'node-18', target: 'node-24', label: '28'},
            {id: 'edge-44', source: 'node-19', target: 'node-12', label: '4'},
            {id: 'edge-45', source: 'node-20', target: 'node-14', label: '12'},
            {id: 'edge-46', source: 'node-21', target: 'node-9', label: '5'},
            {id: 'edge-47', source: 'node-22', target: 'node-14', label: '24'},
            {id: 'edge-48', source: 'node-23', target: 'node-14', label: '0'},
            {id: 'edge-49', source: 'node-24', target: 'node-2', label: '11'}] as EdgeConfig[],
    };

    for (let i = 0; i < data.edges.length; i++) {
        const labelValue = Number(data.edges[i].label);
        let color;
        if (labelValue < 10) {
            color = '#f00';
        } else if (labelValue > 30) {
            color = '#17a617';
        } else {
            color = '#deb600';
        }

        const edgeStyle = data.edges[i].style || {}; // Ensure style is initialized
        edgeStyle.stroke = color;
        data.edges[i].style = edgeStyle;
    }

    return data;
}
