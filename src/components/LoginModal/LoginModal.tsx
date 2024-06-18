import {useState} from "react";
import {Input} from "../AppInputs/InputTypes/Input.ts";
import Modal from "react-modal";
import {ILoginModalProps} from "./ILoginModalProps.tsx";
import {useNavigate} from "react-router-dom";
import {Paths} from "../../constants/Paths.ts";
import {ErrorMessage} from "../ErrorMessage/ErrorMessage.tsx";
import {AppInputs} from "../AppInputs/AppInputs.tsx";
import {fetchProtectedLogin} from "../../utils/loginUtils.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";

export function LoginModal(props: ILoginModalProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const ipAddress = useSelector((state: RootState) => state.ip.ip_address);

    const loginInputs: Input[][] = [
        [{type: "text", label: "Username", value: username, setValue: setUsername}],
        [{type: "text", label: "Password", value: password, setValue: setPassword}],
        [{
            type: "button", label: "Enter", onClick: async () => {
                const logInSuccessResult = await fetchProtectedLogin({username: username, password: password}); // "Success";
                if (logInSuccessResult === "Success") {
                    props.setModalIsOpen(false);
                    navigate(Paths.Settings);
                } else if (logInSuccessResult === "Fail") {
                    setErrorModalIsOpen(true);
                    setErrorMessage('Your Username or Password is incorrect. Please try again!');
                }
            }
        }, {type: "button", label: "Return", onClick: async () => props.setModalIsOpen(false)},
        ]
    ];

    return (
        <>
            <Modal isOpen={props.modalIsOpen} shouldCloseOnOverlayClick={false} ariaHideApp={false}
                   className={`text-white text-3xl text-center flex justify-center items-center h-screen bg-[#000000]/75`}
            >
                <div
                    className="bg-black p-4 rounded-xl w-[50%] h-[50%] flex flex-col justify-center items-center gap-y-8">
                    Login into the device in {ipAddress}
                    <AppInputs appInputs={loginInputs} className={'w-[160%]'}/>
                </div>
            </Modal>
            <ErrorMessage errorMessage={errorMessage} modalIsOpen={errorModalIsOpen}
                          setModalIsOpen={setErrorModalIsOpen}/>
        </>
    );
}