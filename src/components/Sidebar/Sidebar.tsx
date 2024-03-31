import {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {interactExpandingAndCollapsingButton} from "../../redux/Collapsing/collapsingSlice.ts";
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import ExpandCollapseLogo from '../../assets/expand_collapse.svg';
import SettingsLogo from '../../assets/settings.svg';
import TopologyLogo from '../../assets/topology.svg';
import RecordingsLogo from "../../assets/recordings.svg";
import DashboardLogo from "../../assets/dashboard.svg";
import SubsectionsOfRecordingsNavigatorButton from "./SubsectionsOfRecordingsNavigatorButton.tsx";
import {Paths} from "../Paths.ts";

export function Sidebar() {
    const dispatch = useDispatch();

    useEffect(() => {
        if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "reload") {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen z-50">
            <NavigatorButton href="" isSubsection={false} text="" file={ExpandCollapseLogo}
                             onClick={() => dispatch(interactExpandingAndCollapsingButton())}/>
            <NavigatorButton href={Paths.Dashboard} isSubsection={false} text="לוח" file={DashboardLogo}/>
            <div className='mt-[5vh]'>
                <NavigatorButton href={Paths.Main} isSubsection={false} text="הגדרות" file={SettingsLogo}/>
                <NavigatorButton href={Paths.Topology} isSubsection={false} text="טופולוגיה" file={TopologyLogo}/>
                <NavigatorButton
                    href="" isSubsection={false}
                    text="הקלטות" file={RecordingsLogo}
                    possibleHrefSubsections={[Paths.Camera, Paths.Video, Paths.Gallery]}
                    subsections={<SubsectionsOfRecordingsNavigatorButton/>}
                />
            </div>
        </div>
    );
}