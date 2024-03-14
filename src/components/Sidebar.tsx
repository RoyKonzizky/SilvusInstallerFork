import '../App.css';
import {useState} from 'react';
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";

function Sidebar() {
    const [isSandwichCollapsed, setSandwichCollapsed] = useState<boolean>(true);

    const toggleCollapse = () => {
        setSandwichCollapsed(!isSandwichCollapsed);
    };

    return (
        <div
            className="absolute top-0 right-0 p-4 bg-gray-500 text-black flex flex-col items-end min-w-[250px] h-screen"
        >
            <div className="mr-10 mb-2 flex justify-center items-center">
                <button className="bg-gray-500 hover:bg-gray-200 py-2 px-4 rounded" onClick={toggleCollapse}>
                    <img className={`mt-5 mb-5 h-16 w-16`} src="../../public/expand_collapse.svg" alt=""/>
                </button>
            </div>
            <div
                className={`mr-10 mt-32 overflow-x-hidden transition-max-width duration-500 max-w-${isSandwichCollapsed ? '0' : 'screen-sm'}`}
            >
                <NavigatorButton href="/settings" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="הגדרות" file="../../public/settings.svg"/>
                <NavigatorButton href="/topology" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
                                 text="טופולוגיה" file="../../public/topology.svg"/>
                <NavigatorButton
                    href="/recordings" isSandwichCollapsed={isSandwichCollapsed} isSubsection={false}
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