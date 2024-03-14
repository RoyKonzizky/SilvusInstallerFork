import {INavigatorButtonProps} from "./INavigatorButtonProps.ts";
import {useState} from "react";

function NavigatorButton(props: INavigatorButtonProps) {
    const [onThisNavigatorButton, setOnThisNavigatorButton] = useState(true);

    const handleMouseEnter = () => {
        setOnThisNavigatorButton(false);
    };

    const handleMouseLeave = () => {
        setOnThisNavigatorButton(true);
    };

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
             className={`${props.isSubsection ? `bg-gray-200 hover:bg-gray-500 text-xl` : `bg-gray-500 hover:bg-gray-200 text-3xl pr-5 pl-5 pb-3 pt-3`}`}>
            <div className="flex justify-center items-center">
                {!props.isSandwichCollapsed &&
                    <p className="w-[200px]">
                        {props.href && props.text && <a className="text-black" href={props.href}>{props.text}</a>}
                    </p>
                }
                <img className={`mt-5 mb-5 ${props.isSubsection ? 'h-12 w-12' : 'h-16 w-16'}`} src={props.file} alt=""/>
            </div>
            {!onThisNavigatorButton && props.subsections}
        </div>
    );
}

export default NavigatorButton;