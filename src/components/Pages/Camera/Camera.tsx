// import { useEffect, useRef } from 'react';
// import { createManagedDeviceInNode } from 'onvif-rx';
//
// export function Camera() {
//     const videoRef = useRef<HTMLVideoElement>(null);
//
//     useEffect(() => {
//         const device = createManagedDeviceInNode({
//             deviceUrl: 'http://[172.20.239.21]/onvif/media_service',
//             password: 'admin',
//             username: 'admin',
//         });
//
//         device.api.Device.GetUsers()
//             .toPromise()
//             .then(res=> {
//                 res.match({ // results are wrapped in a managed object for safer processing
//                     ok: success => console.log(success.json), // successful response object
//                     fail: railure => console.log(railure.status, railure.statusMessage) // request failure object
//                 })
//             })
//     }, []);
//
//     return (
//         <div className="flex justify-center h-full ml-[5%] w-[80%]">
//             <video controls autoPlay ref={videoRef}/>
//         </div>
//     );
// }
import {useEffect, useRef} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";

export function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isSidebarCollapsed = useSelector((state: RootState) => state.collapsing.isSidebarCollapsed);

    useEffect(() => {
        const socket = new WebSocket('ws://172.20.239.21:80');

        socket.onopen = () => {
            console.log('Connected to RTSP server');
        };

        socket.onmessage = (event) => {
            const videoData = event.data;
            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([videoData]);
            }
        };

        socket.onclose = () => {
            console.log('Connection closed');
        };

        socket.onerror = (error) => {
            console.error('Socket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className={`flex justify-center h-full ${isSidebarCollapsed ? "w-[94%]" : "w-[84%]"}`}>
            <video controls autoPlay ref={videoRef}/>
        </div>
    );
}