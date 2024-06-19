import BottomCircle from "./BottomCircle/BottomCircle.tsx";
import {useState} from "react";
import PresetsButtonModal from "./PresetsButtonModal/PresetsButtonModal.tsx";
import PresetsImage from "../../assets/presets.svg";
import {Paths} from "../../constants/Paths.ts";
import {IPresetsButtonProps} from "./IPresetsButtonProps.ts";

function PresetsButton(props: IPresetsButtonProps) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <div>
            {window.location.href === window.location.origin + Paths.Settings &&
                <div className="flex items-start justify-start absolute bottom-1 left-1 cursor-pointer"
                 onClick={() => setModalIsOpen(true)}>
                <BottomCircle radius={40} image={PresetsImage} bgColor='#303030'/>
            </div>
            }
            <PresetsButtonModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}
                                selectedPreset={props.selectedPreset} setSelectedPreset={props.setSelectedPreset}/>
        </div>
    );
}

export default PresetsButton;