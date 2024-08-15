import axios from "axios";
import { Camera, camsType } from "../../constants/types/devicesDataTypes.ts";
import { IUserNode } from "@antv/graphin";

export type CamStreams = {
    mainStreamLink?: string;
    subStreamLink?: string;
};

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

export const mapCamerasToDevices = (nodes: IUserNode[], cameras: Camera[]) => {
    const cameraMap: { [deviceId: string]: Camera } = {};

    nodes.forEach((node: IUserNode) => {
        const camera = cameras?.find((camera: Camera) => camera.device_id == node.id);
        if (camera) {
            cameraMap[node.id] = camera;
        }
    });

    return cameraMap;
}

export function connectCamToDevice(deviceIp: string, cams: camsType): CamStreams {
    const matchedCam = cams.data.find(cam =>
        cam.device_ip === deviceIp);

    if (matchedCam) {
        return {
            mainStreamLink: matchedCam.main_stream.uri,
            subStreamLink: matchedCam.sub_stream.uri,
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

