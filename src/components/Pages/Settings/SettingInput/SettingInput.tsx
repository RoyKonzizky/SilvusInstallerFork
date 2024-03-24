import {ISettingInputProps} from "./ISettingInputProps.ts";

function SettingInput(props: ISettingInputProps) {
    return (
        <div className={`flex ${props.type === "text" && "bg-[#303030]/70"} p-3 rounded-xl`}>
            {props.type === "text" && <label className="w-[300px] flex items-center text-start">{props.label}</label>}
            <input type={props.type} value={props.type === "button" ? props.label : props.value}
                   onClick={() => {
                       if (props.onClick) props.onClick();
                   }}
                   onChange={(event) => {
                        if (props.setValue) props.setValue(event.target.value);
                   }}
                   className={`text-center bg-gray-600 p-2 rounded-xl ${props.type === "text"
                       ? "w-[250px] text-start"
                       : (props.type === "button" && "cursor-pointer w-full")}`}
            />
        </div>
    );
}

export default SettingInput;