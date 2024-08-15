import {IUserEdge, IUserNode} from "@antv/graphin";
import {batteriesType, devicesType, snrsType} from "../../constants/types/devicesDataTypes.ts";

export const graphStyle = {
    background: "black",
    color: "white"
};

export function createNodesFromData(devices: devicesType, batteries: batteriesType) {
    const nodes: IUserNode[] = [];
    for (let i = 0; i < devices.length; i++) {
        const color = '#1fb639';

        nodes[i] = {
            id: devices[i].id.toString(),
            style: {
                label: {
                    value: devices[i].name.toString() || devices[i].ip.toString(),
                    fill: '#FFFFFF',
                },
                keyshape: {
                    fill: color,
                    stroke: color,
                    fillOpacity: 1,
                    size: 50,
                },
            },
            data: {
                battery: batteries[i].percent.toString(),
                statuses: devices[i].status,
                ip: devices[i].ip,
            },
        };
    }

    return nodes as IUserNode[];
}

export function createEdgesFromData(snrs: snrsType): IUserEdge[] {
    const edges: IUserEdge[] = [];

    for (let i = 0; i < snrs.length; i++) {
        const labelValue = Number(snrs[i].snr);

        let edgeColor;
        if (labelValue < 20) {
            edgeColor = 'red';
        } else if (labelValue > 30) {
            edgeColor = 'green';
        } else {
            edgeColor = 'yellow';
        }

        edges.push({
            id:`${snrs[i].id1}-${snrs[i].id2}`,
            source: snrs[i].id1,
            target: snrs[i].id2,
            style: {
                label: {
                    value: `${labelValue}`,
                    fill: '#FFFFFF',
                    fontSize: 30,
                    offset: [0,15]
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
