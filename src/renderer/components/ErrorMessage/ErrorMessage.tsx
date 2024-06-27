import Modal from "react-modal";
import {IErrorMessageProps} from "./IErrorMessageProps.ts";
import {Input} from "../AppInputs/InputTypes/Input.ts";
import {AppInputs} from "../AppInputs/AppInputs.tsx";
import { useTranslation } from 'react-i18next';

export function ErrorMessage(props: IErrorMessageProps) {
    const { t,  } = useTranslation();

    const errorInputs: Input[][] = [
        [{type: "button", label: t('close'), onClick: () => props.setModalIsOpen(false)}]
    ];

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false} ariaHideApp={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4 rounded-xl">
                {t('error')}: {props.errorMessage}
                <AppInputs appInputs={errorInputs} className={'w-[160%] mt-5'} isSmaller={false}/>
            </div>
        </Modal>
    );
}