import { IUserEdge, IUserNode } from "@antv/graphin";
import { batteriesType, devicesType, snrsType } from "../../constants/types/devicesDataTypes.ts";

export const graphStyle = {
    background: "black",
    color: "white",
};

export function createNodesFromData(devices: devicesType, batteries: batteriesType): IUserNode[] {
    const nodes: IUserNode[] = [];
    const color = '#1fb639';

    for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        const battery = batteries[i];

        nodes[i] = {
            id: device.id.toString(),
            style: {
                label: {
                    value: device.name || device.ip,
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
                battery: battery.percent,
                statuses: device.status,
                ip: device.ip,
            }
        };
    }

    return nodes;
}

export function createEdgesFromData(snrs: snrsType): IUserEdge[] {
    const edges: IUserEdge[] = [];

    for (let i = 0; i < snrs.length; i++) {
        const snr = snrs[i];
        const labelValue = Number(snr.snr);

        let edgeColor;
        if (labelValue < 20) {
            edgeColor = 'red';
        } else if (labelValue > 30) {
            edgeColor = 'green';
        } else {
            edgeColor = 'yellow';
        }

        edges.push({
            id: `${snr.id1}-${snr.id2}`,
            source: snr.id1,
            target: snr.id2,
            style: {
                label: {
                    value: labelValue.toString(),
                    fill: '#FFFFFF',
                    fontSize: 30,
                    offset: [0, 10]
                },
                keyshape: {
                    endArrow: {
                        path: '',
                    },
                    stroke: edgeColor,
                    lineWidth: 6
                },
            },
            data: labelValue.toString(),
        });
    }
    return edges;
}
