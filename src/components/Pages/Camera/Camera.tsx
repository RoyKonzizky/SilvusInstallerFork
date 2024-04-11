import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import ReactPlayer from "react-player";

export function Camera() {
    const isSidebarCollapsed = useSelector((state: RootState) => state.collapsing.isSidebarCollapsed);

    return (
        <div className={`flex justify-center h-full ${isSidebarCollapsed ? "w-[94%]" : "w-[84%]"}`}>
            {/* Change the URL according to the real RTSP link. The RTSP server is managed in the backend */}
            <ReactPlayer
                url="rtsp://localhost:8554/streamName"
                playing={true}
                controls={true}
                width="auto"
                height="auto"
            />
        </div>
    );
}