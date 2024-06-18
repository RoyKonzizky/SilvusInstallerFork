import {useState} from "react";
import {Input, isInputWithOnClick, isInputWithValue} from "../AppInput/InputTypes/Input.ts";
import AppInput from "../AppInput/AppInput.tsx";
import Modal from "react-modal";
import {ILoginModalProps} from "../Pages/Login/ILoginModalProps.tsx";
import {useNavigate} from "react-router-dom";
import {Paths} from "../../constants/Paths.ts";

// import {fetchProtectedLogin} from "../../utils/loginUtils.ts";

export function LoginModal(props: ILoginModalProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const settingInputs: Input[][] = [
        [{type: "text", label: "Username", value: username, setValue: setUsername}],
        [{type: "text", label: "Password", value: password, setValue: setPassword}],
        [{
            type: "button", label: "Enter", onClick: async () => {
                // const isLoggedIn = await fetchProtectedLogin({username: username, password: password});
                const isLoggedIn = true;
                if (isLoggedIn) {
                    props.setModalIsOpen(false);
                    navigate(Paths.Settings);
                }
            }
        }, {type: "button", label: "Return", onClick: async () => props.setModalIsOpen(false)},
        ]
    ];

    return (
        <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false}
               className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
        >
            <div className="bg-black p-4 rounded-xl w-[50%] h-[50%] flex flex-col justify-center items-center gap-y-8">
                {settingInputs.map((inputs, index) => (
                    <div key={index} className="flex justify-center gap-x-8 w-[90%]">
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
            </div>
        </Modal>
    );
}