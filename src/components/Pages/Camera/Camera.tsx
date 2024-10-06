import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {useEffect, useRef} from "react";

export function Camera() {
    const isSidebarCollapsed = useSelector((state: RootState) => state.collapsing.isSidebarCollapsed);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const ws = new WebSocket('http://localhost:8080');
        ws.binaryType = 'arraybuffer';
        ws.onmessage = function (event) {
            if (videoRef.current) {
                videoRef.current.src = URL.createObjectURL(
                    new Blob([event.data], { type: 'video/mp4' })
                );
            }
        };

        return () => {
            ws.close();
        };
    }, []);


    return (
        <div className={`flex justify-center h-full ${isSidebarCollapsed ? "w-[94%]" : "w-[84%]"}`}>
            {/* Change the URL according to the real RTSP link. The RTSP server is managed in the backend */}
            <video ref={videoRef} controls autoPlay/>
        </div>
    );
}