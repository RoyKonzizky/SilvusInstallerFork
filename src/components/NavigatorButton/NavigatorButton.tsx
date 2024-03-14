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
            <a className="flex justify-center items-center text-black" href={props.href}>
                {!props.isSandwichCollapsed &&
                    <p className="w-[200px]">
                        {props.text}
                    </p>
                }
                <img className={`mt-5 mb-5 ${props.isSubsection ? 'h-12 w-12' : 'h-16 w-16'}`} src={props.file} alt=""/>
            </a>
            {!onThisNavigatorButton && props.subsections}
        </div>
    );
}

export default NavigatorButton;