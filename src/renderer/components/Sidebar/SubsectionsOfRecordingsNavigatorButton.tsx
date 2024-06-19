import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CameraLogo from "../../assets/camera.svg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FilmmakerLogo from "../../assets/filmmaker.svg";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GalleryLogo from "../../assets/gallery.svg";
import {Paths} from "../../constants/Paths.ts";

function SubsectionsOfRecordingsNavigatorButton() {
    return (
        <>
            <NavigatorButton href={Paths.Camera} text="מצלמה" file={CameraLogo} isSubsection={true}/>
            <NavigatorButton href={Paths.Video} text="הסרטה" file={FilmmakerLogo} isSubsection={true}/>
            <NavigatorButton href={Paths.Gallery} text="גלריה" file={GalleryLogo} isSubsection={true}/>
        </>
    );
}

export default SubsectionsOfRecordingsNavigatorButton;