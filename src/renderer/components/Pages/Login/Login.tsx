import { useEffect, useState } from "react";
import { Input } from "../../AppInputs/InputTypes/Input.ts";
import { Paths } from "../../../constants/Paths.ts";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "../../LoginModal/LoginModal.tsx";
import { ErrorMessage } from "../../ErrorMessage/ErrorMessage.tsx";
import { AppInputs } from "../../AppInputs/AppInputs.tsx";
import { useDispatch } from "react-redux";
import { setIp } from "../../../redux/IP/IPSlice.ts";
import { useTranslation } from 'react-i18next';
import "../../../i18n.ts";
import { fetchProtectedLogin, netData, startUp } from "../../../utils/loginUtils.ts";
import { serverResponseIpDataType } from "../../../constants/types/serverResponseDataType.ts";

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const callStartup = async () => {
        const startUpData = await startUp();
        if (startUpData?.detail?.type === "Fail") {
            setErrorMessage(startUpData.msg as string);
            setErrorModalIsOpen(true);
        }
        if (startUpData?.type === "Success") {
            setIpAddress((startUpData.msg as serverResponseIpDataType).ip);
        }
    }

    const loginInputs: Input[][] = [
        [{ type: "text", label: t("IP Address"), value: ipAddress, setValue: setIpAddress }],
        [{
            type: "button", label: t("enter"), onClick: async () => {
                const response = await fetchProtectedLogin({
                    radio_ip: ipAddress
                });

                if (response?.msg?.is_protected === 1) {
                    dispatch(setIp(ipAddress));
                    setLoginModalIsOpen(true);
                } else if (response?.msg?.is_protected === 0) {
                    navigate(Paths.Settings);
                } else {
                    setErrorModalIsOpen(true);
                    setErrorMessage(t('loginErrorMessage'));
                }
            }
        }, { type: "button", label: t("refresh"), onClick: callStartup }],
    ];

    useEffect(() => {
        callStartup();
    }, [])

    return (
        <>
            <div className={"h-screen flex flex-col justify-center items-center gap-y-8"}>
                <AppInputs appInputs={loginInputs} className={'w-[200%]'} isSmaller={false} />
            </div>
            <ErrorMessage
                errorMessage={errorMessage}
                modalIsOpen={errorModalIsOpen}
                setModalIsOpen={setErrorModalIsOpen}
            />
            <LoginModal
                modalIsOpen={loginModalIsOpen}
                setModalIsOpen={setLoginModalIsOpen}
            />
        </>
    );
}