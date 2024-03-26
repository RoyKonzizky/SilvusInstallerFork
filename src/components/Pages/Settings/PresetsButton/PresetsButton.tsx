import BottomCircle from "./BottomCircle/BottomCircle.tsx";
import {useState} from "react";
import PresetsButtonModal from "./PresetsButtonModal/PresetsButtonModal.tsx";
import PresetsImage from "../../../../assets/presets.svg";

function PresetsButton() {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            <div className="absolute bottom-1 left-1 cursor-pointer"
                 onClick={() => setModalIsOpen(true)}>
                <BottomCircle radius={40} image={PresetsImage} bgColor='#303030'/>
            </div>
            <PresetsButtonModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}/>
        </>
    );
}

export default PresetsButton;