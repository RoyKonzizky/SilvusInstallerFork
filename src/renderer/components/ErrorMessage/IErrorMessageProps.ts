import {Dispatch, SetStateAction} from "react";

export interface IErrorMessageProps {
    errorMessage: string;
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}