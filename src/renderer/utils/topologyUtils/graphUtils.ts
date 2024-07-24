import {IUserEdge, IUserNode} from "@antv/graphin";
import {batteriesType, camsType, devicesType, snrsType} from "../../constants/types/devicesDataTypes.ts";
import axios from "axios";

export const graphStyle = {
    background: "black",
    width: '100%',
    height: '100%',
    color: "white"
};

export function createNodesFromData(devices: devicesType, batteries: batteriesType, cams: camsType) {
    const nodes: IUserNode[] = [];
    for (let i = 0; i < devices.length; i++) {
        const color = '#1fb639';

        const camStreams = connectCamToDevice(devices[i].ip.toString(), cams);

        nodes[i] = {
            id: devices[i].id.toString(),
            style: {
                label: {
                    value: devices[i].ip.toString(),
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
                battery: batteries[i] ? batteries[i].percent.toString() : 'N/A',
                statuses: [1],
                ip: devices[i].ip,
                camLinks: {
                    mainStreamLink: camStreams?.mainStreamLink,
                    subStreamLink: camStreams?.subStreamLink,
                },
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
            source: snrs[i].id1,
            target: snrs[i].id2,
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

export const getCameras = async () => {
    try {
        const response = await axios.get('http://localhost:8080/get-camera-links');
        // console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};

export type CamStreams = {
    mainStreamLink?: string;
    subStreamLink?: string;
};

export function connectCamToDevice(deviceIp: string, cams: camsType): CamStreams {
    const matchedCam = cams.data.find(cam =>
        cam.camera.connected_to === deviceIp);

    if (matchedCam) {
        return {
            mainStreamLink: matchedCam.camera.main_stream.uri,
            subStreamLink: matchedCam.camera.sub_stream.uri,
        };
    } else {
        return {};
    }
}

export const loadCamerasData = async () => {
    try {
        return await getCameras();
    } catch (error) {
        console.error("Error in receiving cameras", error);
    }
};
