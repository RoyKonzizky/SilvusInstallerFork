import {useState} from "react";
import Modal from "react-modal";
import {useDispatch, useSelector} from "react-redux";
import {IPresetsButtonModalProps} from "./IPresetsButtonModalProps.ts";
import {changeChosenSpectrum} from "../../../../../redux/Presets/presetsSlice.ts";
import {RootState} from "../../../../../redux/store.ts";

function PresetsButtonModal(props: IPresetsButtonModalProps) {
    const dispatch = useDispatch();
    const presets = ["High", "Medium", "Low"];
    const [selectedPreset, setSelectedPreset] = useState(useSelector((state: RootState) => state.presets.chosenSpectrum));

    const handleCloseModal = () => {
        props.setModalIsOpen(false);
        dispatch(changeChosenSpectrum(selectedPreset));
    };

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4">
                <div className="mb-2">Choose your Preset</div>
                {presets.map((preset, index) => (
                    <div key={index} className="flex texl-3xl w-[400px]">
                        <div className={`flex w-16 h-16 m-3 rounded-xl cursor-pointer ${selectedPreset === preset ? 'bg-[#303030]/70' : 'bg-white'}`}
                             onClick={() => setSelectedPreset(preset)}/>
                        <div className="flex items-center">{preset}</div>
                    </div>
                ))}
                <input type="button" className="text-center mt-2 px-4 py-3 rounded-xl cursor-pointer bg-gray-800"
                       onClick={handleCloseModal} value="Save"/>
            </div>
        </Modal>
    );
}

export default PresetsButtonModal;