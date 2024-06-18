import {useState} from "react";
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {Paths} from "../../../constants/Paths.ts";
import {useNavigate} from "react-router-dom";
import {LoginModal} from "../../LoginModal/LoginModal.tsx";
import {isIPv4, isIPv6} from "../../../utils/ipUtils.ts";
import {ErrorMessage} from "../../ErrorMessage/ErrorMessage.tsx";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";
//import {fetchLogin} from "../../../utils/loginUtils.ts";

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const loginInputs: Input[][] = [
        [{type: "text", label: "IP Address", value: ipAddress, setValue: setIpAddress}],
        [{
            type: "button", label: "Enter", onClick: async () => {
                if (ipAddress !== "" && (isIPv4(ipAddress) || isIPv6(ipAddress))) {
                    const isProtectedDevice = true; // await fetchLogin(ipAddress);
                    if (isProtectedDevice) setLoginModalIsOpen(true);
                    else navigate(Paths.Settings);
                } else {
                    setErrorModalIsOpen(true);
                    setErrorMessage('IP is not existed or was inputted incorrectly.');
                }
            }
        }]
    ];

    return (
        <>
            <div className={"h-screen flex flex-col justify-center items-center gap-y-8"}>
                <AppInputs appInputs={loginInputs} className={'w-[200%]'}/>
            </div>
            <ErrorMessage errorMessage={errorMessage} modalIsOpen={errorModalIsOpen}
                          setModalIsOpen={setErrorModalIsOpen}/>
            <LoginModal modalIsOpen={loginModalIsOpen} setModalIsOpen={setLoginModalIsOpen}/>
        </>
    );
}