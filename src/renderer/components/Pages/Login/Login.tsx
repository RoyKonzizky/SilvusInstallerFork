import {useEffect, useState} from "react";
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {Paths} from "../../../constants/Paths.ts";
import {useNavigate} from "react-router-dom";
import {LoginModal} from "../../LoginModal/LoginModal.tsx";
import {isIPv4, isIPv6} from "../../../scripts/ipScripts.ts";
import {ErrorMessage} from "../../ErrorMessage/ErrorMessage.tsx";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";
import {useDispatch} from "react-redux";
import {setIp} from "../../../redux/IP/IPSlice.ts";
import {startUp, startUpDataType} from "../../../utils/loginUtils.ts";
import { useTranslation } from 'react-i18next';
import "../../../i18n.ts";

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [startUpData, setStartUpData] =
        useState<startUpDataType>({type: "", msg: {ip: "", isProtected: 1}});
    const dispatch = useDispatch();
    const [isProtectedDevice, setIsProtectedDevice] = useState(false);
    const { t, } = useTranslation();

    const loginInputs: Input[][] = [
        [{type: "text", label: t("IP Address"), value: ipAddress, setValue: setIpAddress}],
        [{
            type: "button", label: t("enter"), onClick: async () => {
                if (ipAddress !== "" && (isIPv4(ipAddress) || isIPv6(ipAddress))) {
                    dispatch(setIp(ipAddress));
                    if (isProtectedDevice) setLoginModalIsOpen(true);
                    else navigate(Paths.Settings);
                } else {
                    setErrorModalIsOpen(true);
                    setErrorMessage(t('loginErrorMessage'));
                }
            }
        }]
    ];

    useEffect(() => {
        const callStartup = async () => {
            setStartUpData(await startUp());
            if (startUpData.type === "Fail") {
                setErrorMessage(startUpData.msg as string);
                setErrorModalIsOpen(true);
            }
            if (startUpData.type === "Success") {
                setIpAddress((startUpData.msg as {ip: string, isProtected: number}).ip);
                setIsProtectedDevice((startUpData.msg as {ip: string, isProtected: number}).isProtected === 1);
            }
        }
        callStartup();
    }, [startUpData])

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