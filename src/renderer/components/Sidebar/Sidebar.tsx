// import RecordingsLogo from "../../assets/recordings.svg";
// import SubsectionsOfRecordingsNavigatorButton from "./SubsectionsOfRecordingsNavigatorButton.tsx";
import { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { interactExpandingAndCollapsingButton } from "../../redux/Collapsing/collapsingSlice.ts";
import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import ExpandCollapseLogo from '../../assets/expand_collapse.svg';
import SettingsLogo from '../../assets/settings.svg';
import TopologyLogo from '../../assets/topology.svg';
// import DashboardLogo from "../../assets/dashboard.svg";
import LogoutLogo from "../../assets/logout.svg";
import { Paths } from "../../constants/Paths.ts";
import '../../i18n.ts';
import { useTranslation } from 'react-i18next';
import { logout } from "../../utils/loginUtils.ts";

export function Sidebar() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage('he'); // 'he' is a default language
        if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "reload") {
            window.location.href = "/";
        }
    }, [i18n]);

    if (window.location.pathname === Paths.Main) return null;

    const callLogOut = async () => {
        await logout();
    }

    return (
        <>
            <div className="absolute top-0 right-0 p-4 bg-[#7A7A7A] flex flex-col items-end min-w-[100px] h-screen z-50">
                <NavigatorButton
                    href=""
                    isSubsection={false}
                    text=""
                    file={ExpandCollapseLogo}
                    onClick={() => dispatch(interactExpandingAndCollapsingButton())}
                />
                <NavigatorButton
                    href=""
                    isSubsection={false}
                    text={i18n.language === 'he' ? 'עב' : 'EN'}
                    onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'he' : 'en')}
                />
                {/*<NavigatorButton*/}
                {/*    href={Paths.Dashboard}*/}
                {/*    isSubsection={false}*/}
                {/*    text={t('dashboard')}*/}
                {/*    file={DashboardLogo}*/}
                {/*/>*/}
                <div className='mt-[4vh]'>
                    <NavigatorButton
                        href={Paths.Settings}
                        isSubsection={false}
                        text={t('settings')}
                        file={SettingsLogo}
                    />
                    <NavigatorButton
                        href={Paths.Topology}
                        // href="#"
                        isSubsection={false}
                        text={t('topology')}
                        file={TopologyLogo}
                    />
                    {/*<NavigatorButton*/}
                    {/*    href="" isSubsection={false}*/}
                    {/*    text="הקלטות" file={RecordingsLogo}*/}
                    {/*    possibleHrefSubsections={[Paths.Camera, Paths.Video, Paths.Gallery]}*/}
                    {/*    subsections={<SubsectionsOfRecordingsNavigatorButton/>}*/}
                    {/*/>*/}
                </div>
                <div className='mt-[4vh]'>
                    <NavigatorButton
                        onClick={callLogOut}
                        href={Paths.Main}
                        isSubsection={false}
                        text={t('exit')}
                        file={LogoutLogo}
                    />
                </div>
            </div>
        </>
    );
}