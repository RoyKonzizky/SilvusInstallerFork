import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import Settings from "./Settings/Settings.tsx";

function MyRoutes() {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (performance.getEntriesByType("navigation")[0].type === "reload") {
            window.location.href = "/";
        }
    }, []);

    return (
        <>
            <Routes>
                {/* TODO: Change every element to its corresponding element */}
                <Route path="/" element={<>MAIN PAGE</>}/>
                <Route path="/settings" element={<Settings/>}/>
                <Route path="/topology" element={<>TOPOLOGY</>}/>
                <Route path="/recordings" element={<>RECORDINGS</>}/>
                <Route path="/camera" element={<>CAMERA</>}/>
                <Route path="/filmmaker" element={<>FILMMAKER</>}/>
                <Route path="/gallery" element={<>GALLERY</>}/>
            </Routes>
        </>
    );
}

export default MyRoutes;