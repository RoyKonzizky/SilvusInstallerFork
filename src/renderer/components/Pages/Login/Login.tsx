import {useEffect, useState} from "react";
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {Paths} from "../../../constants/Paths.ts";
import {useNavigate} from "react-router-dom";
import {LoginModal} from "../../LoginModal/LoginModal.tsx";
import {ErrorMessage} from "../../ErrorMessage/ErrorMessage.tsx";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";
import {useDispatch} from "react-redux";
import {setIp} from "../../../redux/IP/IPSlice.ts";
import {useTranslation} from 'react-i18next';
import "../../../i18n.ts";
import {netData, startUp} from "../../../utils/loginUtils.ts";
import {serverResponseIpDataType} from "../../../constants/types/serverResponseDataType.ts";

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isProtectedDevice, setIsProtectedDevice] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const callStartup = async () => {
        const startUpData = await startUp();
        if (startUpData.type === "Fail") {
            setErrorMessage(startUpData.msg as string);
            setErrorModalIsOpen(true);
        }
        if (startUpData.type === "Success") {
            setIpAddress((startUpData.msg as serverResponseIpDataType).ip);
            setIsProtectedDevice((startUpData.msg as serverResponseIpDataType).is_protected === 1);
        }
    }

    const loginInputs: Input[][] = [
        [{type: "text", label: t("IP Address"), value: ipAddress, setValue: setIpAddress}],
        [{
            type: "button", label: t("enter"), onClick: async () => {
                const settingRadioIpData = await netData();
                if (settingRadioIpData.data["device_list"].some((device: { ip: string; id: number }) => device.ip === ipAddress)) {
                    dispatch(setIp(ipAddress));
                    if (isProtectedDevice) setLoginModalIsOpen(true);
                    else navigate(Paths.Settings);
                } else {
                    setErrorModalIsOpen(true);
                    setErrorMessage(t('loginErrorMessage'));
                }
            }
        }, {type: "button", label: t("refresh"), onClick: callStartup}],
    ];

    useEffect(() => {
        callStartup();
    }, [])

    return (
        <>
            <div className={"h-screen flex flex-col justify-center items-center gap-y-8"}>
                <AppInputs appInputs={loginInputs} className={'w-[200%]'} isSmaller={false}/>
            </div>
            <ErrorMessage errorMessage={errorMessage} modalIsOpen={errorModalIsOpen}
                          setModalIsOpen={setErrorModalIsOpen}/>
            <LoginModal modalIsOpen={loginModalIsOpen} setModalIsOpen={setLoginModalIsOpen}/>
        </>
    );
}