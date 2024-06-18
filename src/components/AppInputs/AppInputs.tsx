import {IAppInputsProps} from "./IAppInputsProps.ts";
import AppInput from "./AppInput/AppInput.tsx";
import {isInputWithOnClick, isInputWithValue} from "./InputTypes/Input.ts";

export function AppInputs(props: IAppInputsProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-y-8">
            {props.appInputs.map((inputs, index) => (
                <div key={index} className={`flex justify-center gap-x-8 ${props.className}`}>
                    {inputs.map((input, idx) => (
                        <AppInput
                            key={idx} type={input.type} label={input.label}
                            value={isInputWithValue(input) ? input.value : undefined}
                            setValue={isInputWithValue(input) ? input.setValue : undefined}
                            onClick={isInputWithOnClick(input) ? input.onClick : undefined}
                            values={isInputWithValue(input) ? input.values : undefined}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}