import {Dispatch, SetStateAction} from "react";

export interface ISettingInputProps {
    label: string;
    type: string;
    onClick?: () => void;
    value?: string;
    setValue?: Dispatch<SetStateAction<string>>;
}