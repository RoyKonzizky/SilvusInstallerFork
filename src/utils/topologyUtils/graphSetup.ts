import {IUserEdge, IUserNode} from "@antv/graphin";

export const graphStyle = {
    background: "black",
    width: '100%',
    height: '100%',
    color: "white"
};

export function generateData(): { nodes: IUserNode[]; edges: IUserEdge[]; } {
    const data = {
        nodes: [
            {id: 'node-0', label: 'Node-0', data: "battery: 15%"},
            {id: 'node-1', label: 'Node-1', data: "battery: 55%"},
            {id: 'node-2', label: 'Node-2', data: "battery: 45%"},
            {id: 'node-3', label: 'Node-3', data: "battery: 35%"},
            {id: 'node-4', label: 'Node-4', data: "battery: 75%"},
            {id: 'node-5', label: 'Node-5', data: "battery: 25%"},
        ] as IUserNode[],
        edges: [
            {
                id: 'edge-0', source: 'node-0', target: 'node-1', label: '5',
                // data: "10",
            },
            {id: 'edge-1', source: 'node-0', target: 'node-2', label: '12'},
            {id: 'edge-2', source: 'node-1', target: 'node-3', label: '20'},
            {id: 'edge-3', source: 'node-2', target: 'node-4', label: '8'},
            {id: 'edge-4', source: 'node-3', target: 'node-5', label: '15'},
            {id: 'edge-5', source: 'node-1', target: 'node-4', label: '10'},
            {id: 'edge-6', source: 'node-2', target: 'node-5', label: '9'},
            {id: 'edge-7', source: 'node-0', target: 'node-4', label: '33'},
        ] as IUserEdge[],
    };

    for (let i = 0; i < data.nodes.length; i++) {
        const color = '#1fb639';

        data.nodes[i] = {
            id: data.nodes[i].id,
            style: {
                label: {
                    value: data.nodes[i].label,
                    fill: '#FFFFFF',
                },
                keyshape: {
                    fill: color,
                    stroke: color,
                    fillOpacity: 1,
                    size: 50,
                },
            },
        };
    }

    for (let i = 0; i < data.edges.length; i++) {
        const labelValue = Number(data.edges[i].label);

        let edgeColor;
        if (labelValue < 10) {
            edgeColor = 'red';
        } else if (labelValue > 30) {
            edgeColor = 'green';
        } else {
            edgeColor = 'yellow';
        }

        data.edges[i].style = {
            label: {
                value: `${labelValue}`,
                fill: edgeColor,
                fontSize: 30
            },
            keyshape: {
                endArrow: {
                    path: '',
                },
                stroke: edgeColor,
                lineWidth: 6
            },
        };
    }

    return data;
}

export function createNodesFromData(devices: { radio_ip: string, node_ids: string[] | null, node_ips: string[] | null } | null, batteries: any) {
    const nodes = [];
    for (let i = 0; i < devices!.node_ids!.length; i++) {
        const color = '#1fb639';

        nodes[i] = {
            id: devices?.node_ids![i].toString(),
            style: {
                label: {
                    value: devices?.node_ips![i].toString() ,
                    fill: '#FFFFFF',
                },
                keyshape: {
                    fill: color,
                    stroke: color,
                    fillOpacity: 1,
                    size: 50,
                },
            },
            data: batteries[i].percent.toString(),
        };
    }
    return nodes as IUserNode[];
}

export function createEdgesFromData(snrs: [[id1: string, id2:string], string] | null, nodes: IUserNode[]) {
    // @ts-ignore
    const edges = [];

    for (let i = 0; i < snrs!.length; i++) {

    }

    // @ts-ignore
    return edges as IUserEdge[];
}