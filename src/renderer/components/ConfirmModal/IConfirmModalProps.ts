import {Dispatch, SetStateAction} from "react";

export interface IConfirmModalProps {
    text: string;
    onClickYes: () => void;
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}