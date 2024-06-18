import {Dispatch, SetStateAction} from "react";

export interface ILoginModalProps {
    ipAddress: string;
    modalIsOpen: boolean;
    setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}