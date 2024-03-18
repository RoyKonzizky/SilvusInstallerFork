import NavigatorButton from "./NavigatorButton/NavigatorButton.tsx";
import CameraLogo from "../../assets/camera.svg";
import FilmmakerLogo from "../../assets/filmmaker.svg";
import GalleryLogo from "../../assets/gallery.svg";

function SubsectionsOfRecordingsNavigatorButton() {
    return (
        <>
            <NavigatorButton href="/camera" text="מצלמה" file={CameraLogo} isSubsection={true}/>
            <NavigatorButton href="/filmmaker" text="הסרטה" file={FilmmakerLogo} isSubsection={true}/>
            <NavigatorButton href="/gallery" text="גלריה" file={GalleryLogo} isSubsection={true}/>
        </>
    );
}

export default SubsectionsOfRecordingsNavigatorButton;