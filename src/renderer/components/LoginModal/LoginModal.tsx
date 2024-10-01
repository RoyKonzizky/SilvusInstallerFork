import { useState } from "react";
import { Input } from "../AppInputs/InputTypes/Input.ts";
import Modal from "react-modal";
import { ILoginModalProps } from "./ILoginModalProps.tsx";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../constants/Paths.ts";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage.tsx";
import { AppInputs } from "../AppInputs/AppInputs.tsx";
import { fetchProtectedLogin } from "../../utils/loginUtils.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store.ts";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";

export function LoginModal(props: ILoginModalProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const ipAddress = useSelector((state: RootState) => state.ip.ip_address);
    const { t } = useTranslation();

    const loginInputs: Input[][] = [
        [{ type: "text", label: t("username"), value: username, setValue: setUsername }],
        [{ type: "text", label: t("password"), value: password, setValue: setPassword }],
        [{
            type: "button", label: t("enter"), onClick: async () => {
                const response = await fetchProtectedLogin({
                    radio_ip: ipAddress,
                    username: username,
                    password: password
                });
                
                if (response?.type === "Success" && !response.msg.is_protected) {
                    props.setModalIsOpen(false);
                    navigate(Paths.Settings);
                } else if (response?.response?.status === 401) {
                    setErrorModalIsOpen(true);
                    setErrorMessage(t('loginModalErrorMessage'));
                } else {
                    toast.error(t('unknownError'));
                }
            }
        }, { type: "button", label: t("return"), onClick: async () => props.setModalIsOpen(false) },
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
                    className="bg-black p-4 rounded-xl w-[70%] h-[70%] flex flex-col justify-center items-center gap-y-8">
                    {t("loginModalHeader")} {ipAddress}
                    <AppInputs appInputs={loginInputs} className={'w-[160%]'} isSmaller={false} />
                </div>
            </Modal>
            <ErrorMessage
                errorMessage={errorMessage}
                modalIsOpen={errorModalIsOpen}
                setModalIsOpen={setErrorModalIsOpen}
            />
        </>
    );
}