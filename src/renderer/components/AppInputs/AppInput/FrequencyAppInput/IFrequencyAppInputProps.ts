import {Dispatch, SetStateAction} from "react";

export interface IFrequencyAppInputProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
}