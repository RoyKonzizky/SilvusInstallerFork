import {Dispatch, SetStateAction} from "react";

export interface IPresetsButtonModalProps {
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedPreset: string;
    setSelectedPreset: Dispatch<SetStateAction<string>>;
}