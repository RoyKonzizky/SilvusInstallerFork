import {Dispatch, SetStateAction} from "react";

export interface ILoginModalProps {
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}