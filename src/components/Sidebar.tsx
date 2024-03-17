import '../App.css';
import {useEffect, useState} from 'react';
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";

function Sidebar() {
    const [isSandwichCollapsed, setSandwichCollapsed] = useState<boolean>(true);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (performance.getEntriesByType("navigation")[0].type === "reload") {
            window.location.href = "/";
        }
    }, []);

    return (
        <div
            className="absolute top-0 right-0 p-4 bg-gray-500 text-black flex flex-col items-end min-w-[100px] h-screen"
        >
            <div className="mb-2">
                <NavigatorButton href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="" file="../../public/expand_collapse.svg"
                                 onClick={() => setSandwichCollapsed(!isSandwichCollapsed)}/>
            </div>
            <div
                className={`mt-[10vh] overflow-x-hidden transition-max-width duration-500 max-w-${isSandwichCollapsed ? '0' : 'screen-sm'}`}
            >
                <NavigatorButton href="/settings" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="הגדרות" file="../../public/settings.svg"/>
                <NavigatorButton href="/topology" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="טופולוגיה" file="../../public/topology.svg"/>
                <NavigatorButton
                    href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                    text="הקלטות" file="../../public/recordings.svg"
                    subsections={
                        <>
                            <NavigatorButton href="/camera" isSandwichCollapsed={isSandwichCollapsed}
                                             text="מצלמה" file="../../public/camera.svg" isSubsection={true}/>
                            <NavigatorButton href="/filmmaker" isSandwichCollapsed={isSandwichCollapsed}
                                             text="הסרטה" file="../../public/filmmaker.svg" isSubsection={true}/>
                            <NavigatorButton href="/gallery" isSandwichCollapsed={isSandwichCollapsed}
                                             text="גלריה" file="../../public/gallery.svg" isSubsection={true}/>
                        </>
                    }
                />
            </div>
        </div>
    );
}

export default Sidebar;