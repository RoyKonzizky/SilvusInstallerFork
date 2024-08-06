import axios from "axios";
import {camsType} from "../../constants/types/devicesDataTypes.ts";

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

