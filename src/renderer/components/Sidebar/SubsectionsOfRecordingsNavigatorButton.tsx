import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import CameraLogo from "../../assets/camera.svg";
import FilmmakerLogo from "../../assets/filmmaker.svg";
import GalleryLogo from "../../assets/gallery.svg";
import {Paths} from "../../constants/Paths.ts";
import { useTranslation } from 'react-i18next';

function SubsectionsOfRecordingsNavigatorButton() {
    const { t, } = useTranslation();

    return (
        <>
            <NavigatorButton href={Paths.Camera} text={t('camera')} file={CameraLogo} isSubsection={true}/>
            <NavigatorButton href={Paths.Video} text={t('video')} file={FilmmakerLogo} isSubsection={true}/>
            <NavigatorButton href={Paths.Gallery} text={t('gallery')} file={GalleryLogo} isSubsection={true}/>
        </>
    );
}

export default SubsectionsOfRecordingsNavigatorButton;