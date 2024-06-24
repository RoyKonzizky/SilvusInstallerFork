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

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [startUpData, setStartUpData] =
        useState<startUpDataType>({type: "", msg: {ip: "", isProtected: 1}});
    const dispatch = useDispatch();

    const loginInputs: Input[][] = [
        [{type: "text", label: "IP Address", value: ipAddress ?? startUpData.msg.ip, setValue: setIpAddress ?? startUpData.msg.ip}],
        [{
            type: "button", label: "Enter", onClick: async () => {
                if (ipAddress !== "" && (isIPv4(ipAddress) || isIPv6(ipAddress))) {
                    const isProtectedDevice = startUpData.msg.isProtected;
                    dispatch(setIp(ipAddress));
                    if (isProtectedDevice) setLoginModalIsOpen(true);
                    else navigate(Paths.Settings);
                } else {
                    setErrorModalIsOpen(true);
                    setErrorMessage('IP is not existed or was inputted incorrectly.');
                }
            }
        }]
    ];

    useEffect(() => {
        const callStartup = async () => {
            setStartUpData(await startUp());
        }
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