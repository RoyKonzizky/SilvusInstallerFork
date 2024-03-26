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
               className={`text-black text-3xl text-center font-bold flex justify-center items-center h-screen`}
        >
            <div className="bg-white p-5">
                <div className="mb-2">Choose your Preset</div>
                {presets.map((preset, index) => (
                    <div key={index} className="flex texl-3xl w-[400px]">
                        <div className={`flex w-16 h-16 m-3 rounded-xl cursor-pointer ${selectedPreset === preset ? 'bg-gray-400' : 'bg-black'}`}
                             onClick={() => setSelectedPreset(preset)}/>
                        <div className="flex items-center">{preset}</div>
                    </div>
                ))}
                <input type="button" className="text-center mt-2 p-2 rounded-xl cursor-pointer w-[200px] bg-gray-400"
                       onClick={handleCloseModal} value="Close"/>
            </div>
        </Modal>
    );
}

export default PresetsButtonModal;