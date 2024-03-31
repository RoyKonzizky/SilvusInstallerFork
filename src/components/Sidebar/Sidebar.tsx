import {useEffect} from 'react';
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import ExpandCollapseLogo from '../../assets/expand_collapse.svg';
import SettingsLogo from '../../assets/settings.svg';
import TopologyLogo from '../../assets/topology.svg';
import {useDispatch} from "react-redux";
import {interactExpandingAndCollapsingButton} from "../../redux/Collapsing/collapsingSlice.ts";
import RecordingsLogo from "../../assets/recordings.svg";
import SubsectionsOfRecordingsNavigatorButton from "./SubsectionsOfRecordingsNavigatorButton.tsx";

function Sidebar() {
    const dispatch = useDispatch();

    useEffect(() => {
        if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "reload") {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen">
            <NavigatorButton href="" isSubsection={false} text="" file={ExpandCollapseLogo}
                             onClick={() => dispatch(interactExpandingAndCollapsingButton())}/>
            <div className='mt-[10vh]'>
                <NavigatorButton href="/settings" isSubsection={false} text="הגדרות" file={SettingsLogo}/>
                <NavigatorButton href="/topology" isSubsection={false} text="טופולוגיה" file={TopologyLogo}/>
                <NavigatorButton href="" isSubsection={false} text="הקלטות" file={RecordingsLogo}
                                 subsections={<SubsectionsOfRecordingsNavigatorButton/>}/>
            </div>
        </div>
    );
}

export default Sidebar;