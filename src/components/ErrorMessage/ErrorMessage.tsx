import Modal from "react-modal";
import {IErrorMessageProps} from "./IErrorMessageProps.ts";
import {Input} from "../AppInputs/InputTypes/Input.ts";
import {AppInputs} from "../AppInputs/AppInputs.tsx";

export function ErrorMessage(props: IErrorMessageProps) {
    const errorInputs: Input[][] = [
        [{type: "button", label: "Close", onClick: () => props.setModalIsOpen(false)}]
    ];

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4 rounded-xl">
                Error: {props.errorMessage}
                <AppInputs appInputs={errorInputs} className={'w-[160%] mt-5'}/>
            </div>
        </Modal>
    );
}