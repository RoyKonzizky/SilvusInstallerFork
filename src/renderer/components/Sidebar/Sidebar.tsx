import {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {interactExpandingAndCollapsingButton} from "../../redux/Collapsing/collapsingSlice.ts";
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ExpandCollapseLogo from '../../assets/expand_collapse.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SettingsLogo from '../../assets/settings.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import TopologyLogo from '../../assets/topology.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DashboardLogo from "../../assets/dashboard.svg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import RecordingsLogo from "../../assets/recordings.svg";
// import SubsectionsOfRecordingsNavigatorButton from "./SubsectionsOfRecordingsNavigatorButton.tsx";
import {Paths} from "../../constants/Paths.ts";
import PresetsButton from "../PresetsButton/PresetsButton.tsx";

export function Sidebar() {
    const dispatch = useDispatch();

    useEffect(() => {
        if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "reload") {
            window.location.href = "/";
        }
    }, []);

    if (window.location.pathname === Paths.Main) return null;

    return (
        <>
            <div
                className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen z-50">
                <NavigatorButton href="" isSubsection={false} text="" file={ExpandCollapseLogo}
                                 onClick={() => dispatch(interactExpandingAndCollapsingButton())}/>
                <NavigatorButton href={Paths.Dashboard} isSubsection={false} text="לוח" file={DashboardLogo}/>
                <div className='mt-[5vh]'>
                    <NavigatorButton href={Paths.Settings} isSubsection={false} text="הגדרות" file={SettingsLogo}/>
                    <NavigatorButton href={Paths.Topology} isSubsection={false} text="טופולוגיה" file={TopologyLogo}/>
                    {/*<NavigatorButton*/}
                    {/*    href="" isSubsection={false}*/}
                    {/*    text="הקלטות" file={RecordingsLogo}*/}
                    {/*    possibleHrefSubsections={[Paths.Camera, Paths.Video, Paths.Gallery]}*/}
                    {/*    subsections={<SubsectionsOfRecordingsNavigatorButton/>}*/}
                    {/*/>*/}
                </div>
            </div>
            <PresetsButton/>
        </>
    );
}