import {useEffect, useState} from 'react';
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import ExpandCollapseLogo from '../assets/expand_collapse.svg';
import SettingsLogo from '../assets/settings.svg';
import TopologyLogo from '../assets/topology.svg';
import RecordingsLogo from '../assets/recordings.svg';
import CameraLogo from '../assets/camera.svg';
import FilmmakerLogo from '../assets/filmmaker.svg';
import GalleryLogo from '../assets/gallery.svg';
import {Paths} from "./Paths.ts";

function Sidebar() {
    const [isSandwichCollapsed, setSandwichCollapsed] = useState<boolean>(true);

    useEffect(() => {
        if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "reload") {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen z-50">
            <NavigatorButton href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                             text="" file={ExpandCollapseLogo}
                             onClick={() => setSandwichCollapsed(!isSandwichCollapsed)}/>
            <div className='mt-[10vh]'>
                <NavigatorButton href={Paths.Main} isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="הגדרות" file={SettingsLogo}/>
                <NavigatorButton href={Paths.Topology} isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="טופולוגיה" file={TopologyLogo}/>
                <NavigatorButton
                    href="" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                    text="הקלטות" file={RecordingsLogo}
                    possibleHrefSubsections={[Paths.Photo, Paths.Video, Paths.Gallery]}
                    subsections={
                        <>
                            <NavigatorButton href={Paths.Photo} isSandwichCollapsed={isSandwichCollapsed}
                                             text="מצלמה" file={CameraLogo} isSubsection={true}/>
                            <NavigatorButton href={Paths.Video} isSandwichCollapsed={isSandwichCollapsed}
                                             text="הסרטה" file={FilmmakerLogo} isSubsection={true}/>
                            <NavigatorButton href={Paths.Gallery} isSandwichCollapsed={isSandwichCollapsed}
                                             text="גלריה" file={GalleryLogo} isSubsection={true}/>
                        </>
                    }
                />
            </div>
        </div>
    );
}

export default Sidebar;