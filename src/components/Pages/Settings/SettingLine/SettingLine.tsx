import {ISettingLineProps} from "./ISettingLineProps.ts";

function SettingLine(props: ISettingLineProps) {
    return (
        <>
            <label>{props.label}</label>
            <input type="text" className="bg-neutral-50 text-black ml-10 mr-10 w-80 text-center"/>
        </>
    );
}

export default SettingLine;