import Modal from "react-modal";
import {IPresetsButtonModalProps} from "./IPresetsButtonModalProps.ts";
import {useState} from "react";
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";
import { useTranslation } from 'react-i18next';

function PresetsButtonModal(props: IPresetsButtonModalProps) {
    const [selectedPreset, setSelectedPreset] = useState(props.selectedPreset);
    const presets = ["High", "Medium", "Low"];
    const { t, i18n } = useTranslation();

    const presetsInputs: Input[][] = [
        [
            {
                type: "button", label: t("save"), onClick: () => {
                    props.setSelectedPreset(selectedPreset);
                    props.setModalIsOpen(false);
                }
            },
            {type: "button", label: t("close"), onClick: () => props.setModalIsOpen(false)},
        ]
    ];

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false} ariaHideApp={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4 rounded-xl">
                <div className={`mb-2 flex ${i18n.language === 'he' && "justify-end"}`}>{t('presetHeader')}</div>
                {presets.map((preset, index) => (
                    <div key={index} className={`flex texl-3xl w-[400px] ${i18n.language === 'he' && "justify-end"}`}>
                        {i18n.language === 'he' && <div className="flex items-center">{t(`preset${preset}`)}</div> }
                        <div
                            className={`flex w-16 h-16 m-3 rounded-xl cursor-pointer ${selectedPreset === preset ? 'bg-[#303030]/70' : 'bg-white'}`}
                            onClick={() => setSelectedPreset(preset)}/>
                        {i18n.language === 'en' && <div className="flex items-center">{t(`preset${preset}`)}</div> }
                    </div>
                ))}
                <AppInputs appInputs={presetsInputs} className={'w-[200%]'} isSmaller={false}/>
            </div>
        </Modal>
    );
}

export default PresetsButtonModal;