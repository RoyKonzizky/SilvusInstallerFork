import {IUserEdge, IUserNode} from "@antv/graphin";
import {devicesType, snrsType} from "../../constants/types/devicesDataTypes.ts";
export const colorOnline = '#1fb639';
export const colorOffline = '#b61f1f';
export const colorMaster = '#ff8600';
export const DEFAULT_NODE_FONT_SIZE = 30;
export const DEFAULT_NODE_SHAPE_SIZE = 50;
export const DEFAULT_NODE_KEYSHAPE_SIZE = 50;
export const DEFAULT_EDGE_FONT_SIZE = 30;
export const DEFAULT_EDGE_SHAPE_SIZE = 6;
export const DEFAULT_HALO_SHAPE_SIZE = 30;
export const DEFAULT_HALO_LINE_SIZE = 30;
export const graphStyle = {
    background: "transparent",
    color: "white"
};

export function createNodesFromData(devices: devicesType, sizeInterval: number, masterIp: string) {
    const nodes: IUserNode[] = [];
    for (let i = 0; i < devices.length; i++) {

        nodes[i] = {
            id: devices[i].id.toString(),
            style: {
                label: {
                    value: devices[i].name.toString() || devices[i].ip.toString(),
                    fill: '#FFFFFF',
                    fontSize: DEFAULT_NODE_FONT_SIZE * sizeInterval,
                },
                keyshape: {
                    fill: devices[i].is_online ? colorOnline : colorOffline,
                    stroke: devices[i].is_online ? colorOnline : colorOffline,
                    fillOpacity: 1,
                    size: DEFAULT_NODE_KEYSHAPE_SIZE * sizeInterval,
                },
                halo: {
                    size: DEFAULT_HALO_SHAPE_SIZE * sizeInterval,
                    fill: colorMaster,
                    stroke: colorMaster,
                    lineWidth: DEFAULT_HALO_LINE_SIZE * sizeInterval,
                    opacity: 1,
                    visible: devices[i].ip === masterIp,
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
                    fontSize: DEFAULT_EDGE_FONT_SIZE * sizeInterval,
                    offset: [0,15]
                },
                keyshape: {
                    endArrow: {
                        path: '',
                    },
                    stroke: edgeColor,
                    lineWidth: DEFAULT_EDGE_SHAPE_SIZE * sizeInterval
                },
            },
            data: `${labelValue.toString()}`,
        });
    }
    return edges;
}
