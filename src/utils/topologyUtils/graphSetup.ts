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
            {id: 'node-0', label: 'Node-0',},
            {id: 'node-1', label: 'Node-1',},
            {id: 'node-2', label: 'Node-2',},
            {id: 'node-3', label: 'Node-3',},
            {id: 'node-4', label: 'Node-4',},
            {id: 'node-5', label: 'Node-5',},
        ] as IUserNode[],
        edges: [
            { id: 'edge-0', source: 'node-0', target: 'node-1', label: '5' },
            { id: 'edge-1', source: 'node-0', target: 'node-2', label: '12' },
            { id: 'edge-2', source: 'node-1', target: 'node-3', label: '20' },
            { id: 'edge-3', source: 'node-2', target: 'node-4', label: '8' },
            { id: 'edge-4', source: 'node-3', target: 'node-5', label: '15' },
            { id: 'edge-5', source: 'node-1', target: 'node-4', label: '10' },
            { id: 'edge-6', source: 'node-2', target: 'node-5', label: '9' },
            { id: 'edge-7', source: 'node-0', target: 'node-4', label: '33' },
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