import {IUserEdge, IUserNode} from "@antv/graphin";
import {devicesType, snrsType} from "../../constants/types/devicesDataTypes.ts";
export const colorOnline = '#1fb639';
export const colorOffline = '#b61f1f';

export const graphStyle = {
    background: "black",
    color: "white"
};

export function createNodesFromData(devices: devicesType, sizeInterval: number) {
    const nodes: IUserNode[] = [];
    for (let i = 0; i < devices.length; i++) {

        nodes[i] = {
            id: devices[i].id.toString(),
            style: {
                label: {
                    value: devices[i].name.toString() || devices[i].ip.toString(),
                    fill: '#FFFFFF',
                    fontSize: 15 * sizeInterval,
                },
                keyshape: {
                    fill: devices[i].is_online ? colorOnline : colorOffline,
                    stroke: devices[i].is_online ? colorOnline : colorOffline,
                    fillOpacity: 1,
                    size: 50 * sizeInterval,
                },
            },
            data: {
                battery: devices[i].percent.toString(),
                statuses: devices[i].status,
                ip: devices[i].ip,
                isOnline: devices[i].is_online
            },
        };
    }

    return nodes as IUserNode[];
}

export function createEdgesFromData(snrs: snrsType, sizeInterval: number): IUserEdge[] {
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
                    fontSize: 30 * sizeInterval,
                    offset: [0,15]
                },
                keyshape: {
                    endArrow: {
                        path: '',
                    },
                    stroke: edgeColor,
                    lineWidth: 6 * sizeInterval
                },
            },
            data: `${labelValue.toString()}`,
        });
    }
    return edges;
}
