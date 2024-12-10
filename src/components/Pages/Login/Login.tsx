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
import { fetchProtectedLogin, startUp } from "../../../utils/loginUtils.ts";
import {serverResponseErrorType, serverResponseIpDataType} from "../../../constants/types/serverResponseDataType.ts";
import {toast} from "react-toastify";
import lizi from '../../../../public/Lizi.png'

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const callStartup = async () => {
        try {
            const startUpData = await startUp();

            // Check if the data contains the IP address
            if (startUpData.msg && (startUpData.msg as serverResponseIpDataType).ip) {
                setIpAddress((startUpData.msg as serverResponseIpDataType).ip);
                toast.success(t("ipRefreshGood"));
            } else if (startUpData.detail) {
                // Handle known error structure
                const { msg } = startUpData.detail as serverResponseErrorType;
                setErrorMessage(msg);
                setErrorModalIsOpen(true);
            } else {
                // Handle unexpected structure
                throw new Error("Unexpected data format");
            }
        } catch (e) {
            // Fallback for unexpected errors
            console.error(e); // Log the error for debugging
            toast.error(t("ipRefreshBad"));
        }
    };

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
            <div className="relative h-screen flex flex-col justify-center items-center gap-y-8">
                <img
                    src={lizi}
                    alt="liziLogo"
                    className="w-40 h-40 absolute top-10 rounded-full"
                />
                <div style={{ fontFamily: 'sans-serif', direction: 'rtl', textAlign: 'right', fontSize: '24px' }}>
                    וְהוֹדַעְתָּ לָהֶם, אֶת-הַדֶּרֶךְ יֵלְכוּ בָהּ, וְאֶת-הַמַּעֲשֶׂה, אֲשֶׁר יַעֲשׂוּן
                </div>
                <AppInputs
                    appInputs={loginInputs}
                    className="w-[200%]"
                    isSmaller={false}
                />
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