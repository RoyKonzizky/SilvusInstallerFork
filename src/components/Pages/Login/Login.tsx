import {useState} from "react";
import {LoginModal} from "../../LoginModal/LoginModal.tsx";
import {Input, isInputWithOnClick, isInputWithValue} from "../../AppInput/InputTypes/Input.ts";
import AppInput from "../../AppInput/AppInput.tsx";
import {Paths} from "../../../constants/Paths.ts";
import {useNavigate} from "react-router-dom";
import {fetchLogin} from "../../../utils/loginUtils.ts";

export function Login() {
    const navigate = useNavigate();
    const [ipAddress, setIpAddress] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const settingInputs: Input[][] = [
        [{type: "text", label: "IP Address", value: ipAddress, setValue: setIpAddress}],
        [{
            type: "button", label: "Enter", onClick: async () => {
                const isProtectedDevice = await fetchLogin(ipAddress);
                // const isProtectedDevice = true;
                if (ipAddress !== "") {
                    if (isProtectedDevice) {
                        setModalIsOpen(true);
                    } else {
                        navigate(Paths.Settings);
                    }
                }
            }
        }]
    ];

    return (
        <div className={"h-screen flex flex-col justify-center items-center gap-y-8"}>
            {settingInputs.map((inputs, index) => (
                <div key={index} className="flex justify-center gap-x-8 w-[50%]">
                    {inputs.map((input, idx) => (
                        <AppInput
                            key={idx} type={input.type} label={input.label}
                            value={isInputWithValue(input) ? input.value : undefined}
                            setValue={isInputWithValue(input) ? input.setValue : undefined}
                            onClick={isInputWithOnClick(input) ? input.onClick : undefined}
                        />
                    ))}
                </div>
            ))}
            <LoginModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen}/>
        </div>
    );
}