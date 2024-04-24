import {InputWithValue} from "./InputWithValue.ts";
import {InputWithOnClick} from "./InputWithOnClick.ts";

export type Input = InputWithValue | InputWithOnClick;

export function isInputWithValue(input: Input): input is InputWithValue {
    return (input as InputWithValue).value !== undefined;
}

export function isInputWithOnClick(input: Input): input is InputWithOnClick {
    return (input as InputWithOnClick).onClick !== undefined;
}