import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";

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
                <Route path="/settings" element={<>SETTINGS</>}/>
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