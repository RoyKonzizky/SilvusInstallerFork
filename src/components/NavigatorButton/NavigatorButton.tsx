import {INavigatorButtonProps} from "./INavigatorButtonProps.ts";
import {useState} from "react";

function NavigatorButton(props: INavigatorButtonProps) {
    const [onThisNavigatorButton, setOnThisNavigatorButton] = useState(true);
    const [mirroredImage, setMirroredImage] = useState('');

    return (
        <div onMouseEnter={() => setOnThisNavigatorButton(false)} onMouseLeave={() => setOnThisNavigatorButton(true)}
             onClick={() => {
                 if (props.onClick) {
                     props.onClick();
                     setMirroredImage(props.isSandwichCollapsed ? 'scale-x-[-1]' : '')
                 }
                 if (props.href !== "") window.location.href = props.href;
             }}
             className={`mt-5 mb-5 rounded-xl ${props.isSubsection
                 ? `bg-gray-300 hover:bg-[#7A7A7A] text-white text-xl p-2`
                 : `bg-[#7A7A7A] hover:bg-gray-300 text-black text-3xl p-3`}`}
        >
            <div className="flex justify-center items-center">
                {!props.isSandwichCollapsed && props.text &&
                    <p className="w-[200px]">
                        {props.text}
                    </p>
                }
                <img className={`${props.isSubsection ? 'h-12 w-12' : 'h-16 w-16'} ${mirroredImage}`} src={props.file}
                     alt=""/>
            </div>
            {!onThisNavigatorButton && props.subsections}
        </div>
    );
}

export default NavigatorButton;