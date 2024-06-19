import {Dispatch, SetStateAction} from "react";

export interface IPresetsButtonProps {
    selectedPreset: string;
    setSelectedPreset: Dispatch<SetStateAction<string>>;
}