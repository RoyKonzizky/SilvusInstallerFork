import {Dispatch, SetStateAction} from "react";

export interface InputWithValue {
    type: string;
    label: string;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    values?: string[];
    additionalText?: string;
}