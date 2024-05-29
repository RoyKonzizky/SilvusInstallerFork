import {IUserEdge, IUserNode} from "@antv/graphin";
import {batteriesType, devicesType, snrsType} from "../webConnectionUtils.ts";

export const graphStyle = {
    background: "black",
    width: '100%',
    height: '100%',
    color: "white"
};

export function createNodesFromData(devices: devicesType, batteries: batteriesType) {
    const nodes: IUserNode[] = [];
    for (let i = 0; i < devices.node_ids.length; i++) {
        const color = '#1fb639';

        nodes[i] = {
            id: devices.node_ids[i].toString(),
            style: {
                label: {
                    value: devices.node_ips[i].toString(),
                    fill: '#FFFFFF',
                },
                keyshape: {
                    fill: color,
                    stroke: color,
                    fillOpacity: 1,
                    size: 50,
                },
            },
            data: batteries[i] ? batteries[i].percent.toString() : 'N/A',
        };
    }
    return nodes as IUserNode[];
}

export function createEdgesFromData(snrs: snrsType): IUserEdge[] {
    const edges: IUserEdge[] = [];

    for (const snrElement of snrs) {
        const [nodeIds, snr] = snrElement;
        const labelValue = Number(snr);

        let edgeColor;
        if (labelValue < 30) {
            edgeColor = 'red';
        } else if (labelValue > 60) {
            edgeColor = 'green';
        } else {
            edgeColor = 'yellow';
        }

        edges.push({
            source: nodeIds[0],
            target: nodeIds[1],
            style: {
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
            },
            data: `${labelValue.toString()}`,
        });
    }
    return edges;
}

export function removeDuplicates(arr: snrsType): snrsType {
    return arr.filter((item,
        index)=> arr.indexOf(item) === index);
}