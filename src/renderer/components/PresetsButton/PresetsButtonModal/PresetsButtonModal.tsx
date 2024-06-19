import Modal from "react-modal";
import {IPresetsButtonModalProps} from "./IPresetsButtonModalProps.ts";
import {useState} from "react";

function PresetsButtonModal(props: IPresetsButtonModalProps) {
    const [selectedPreset, setSelectedPreset] = useState(props.selectedPreset);
    const presets = ["High", "Medium", "Low"];

    const handleCloseModal = () => {
        props.setSelectedPreset(selectedPreset);
        props.setModalIsOpen(false);
    };

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false} ariaHideApp={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4 rounded-xl">
                <div className="mb-2">Choose your Preset</div>
                {presets.map((preset, index) => (
                    <div key={index} className="flex texl-3xl w-[400px]">
                        <div className={`flex w-16 h-16 m-3 rounded-xl cursor-pointer ${selectedPreset === preset ? 'bg-[#303030]/70' : 'bg-white'}`}
                             onClick={() => setSelectedPreset(preset)}/>
                        <div className="flex items-center">{preset}</div>
                    </div>
                ))}
                <input type="button" className="text-center mt-2 cursor-pointer bg-gray-800 inline-block px-6 py-3 font-semibold rounded-full border border-transparent border-3 border-teal-500 text-teal-500 transition duration-150 ease-in-out"
                       onClick={handleCloseModal} value="Save"/>
            </div>
        </Modal>
    );
}

export default PresetsButtonModal;