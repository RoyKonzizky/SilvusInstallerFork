import {useTranslation} from "react-i18next";
import {Input} from "../AppInputs/InputTypes/Input.ts";
import Modal from "react-modal";
import {AppInputs} from "../AppInputs/AppInputs.tsx";
import {IConfirmModalProps} from "./IConfirmModalProps.ts";

export function ConfirmModal(props: IConfirmModalProps) {
    const {t} = useTranslation();

    const loginInputs: Input[][] = [
        [{
            type: "button", label: t("yes"), onClick: async () => {
                props.setModalIsOpen(false);
                props.onClickYes();
            }
        }, {type: "button", label: t("no"), onClick: async () => props.setModalIsOpen(false)},
        ]
    ];

    return (
        <>
            <Modal
                isOpen={props.modalIsOpen}
                shouldCloseOnOverlayClick={false}
                ariaHideApp={false}
                className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
            >
                <div
                    className="bg-black p-4 rounded-xl w-[50%] h-[50%] flex flex-col justify-center items-center gap-y-8">
                    {props.text}
                    <AppInputs appInputs={loginInputs} className={'w-[160%]'} isSmaller={false}/>
                </div>
            </Modal>
        </>
    );
}