import '../App.css';
import {useEffect, useState} from 'react';
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import ExpandCollapseLogo from '../assets/expand_collapse.svg';
import SettingsLogo from '../assets/settings.svg';
import TopologyLogo from '../assets/topology.svg';
import RecordingsLogo from '../assets/recordings.svg';
import CameraLogo from '../assets/camera.svg';
import FilmmakerLogo from '../assets/filmmaker.svg';
import GalleryLogo from '../assets/gallery.svg';

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
            className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen z-50"
        >
            <div className="mb-2">
                <NavigatorButton href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="" file={ExpandCollapseLogo}
                                 onClick={() => setSandwichCollapsed(!isSandwichCollapsed)}/>
            </div>
            <div
                className={`mt-[10vh] overflow-x-hidden transition-max-width duration-500 z-50 max-w-${isSandwichCollapsed ? '0' : 'screen-sm'}`}
            >
                <NavigatorButton href="/settings" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="הגדרות" file={SettingsLogo}/>
                <NavigatorButton href="/topology" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="טופולוגיה" file={TopologyLogo}/>
                <NavigatorButton
                    href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                    text="הקלטות" file={RecordingsLogo}
                    subsections={
                        <>
                            <NavigatorButton href="/camera" isSandwichCollapsed={isSandwichCollapsed}
                                             text="מצלמה" file={CameraLogo} isSubsection={true}/>
                            <NavigatorButton href="/filmmaker" isSandwichCollapsed={isSandwichCollapsed}
                                             text="הסרטה" file={FilmmakerLogo} isSubsection={true}/>
                            <NavigatorButton href="/gallery" isSandwichCollapsed={isSandwichCollapsed}
                                             text="גלריה" file={GalleryLogo} isSubsection={true}/>
                        </>
                    }
                />
            </div>
        </div>
    );
}

export default Sidebar;