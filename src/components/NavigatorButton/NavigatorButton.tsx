import {INavigatorButtonProps} from "./INavigatorButtonProps.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function NavigatorButton(props: INavigatorButtonProps) {
    const navigate = useNavigate(); // Get the navigate function from the router context
    const { origin, href } = window.location;
    const [mirroredImage, setMirroredImage] = useState('');
    const [isPressed, setPressed] = useState(false);

    function hrefCheck() {
        return href === origin + props.href || (props.subsections && props.possibleHrefSubsections?.some(subsection => href === `${origin}${subsection}`));
    }

    return (
        <div
            onClick={() => {
                setPressed(!isPressed);
                if (props.onClick) {
                    props.onClick();
                    setMirroredImage(props.isSandwichCollapsed ? 'scale-x-[-1]' : '')
                }
                if (props.href !== "") {
                    navigate(props.href);
                    const res = hrefCheck();
                    setPressed(res ? res : false);
                }
            }}
            className={`mt-5 mb-5 rounded-xl cursor-pointer ${props.isSubsection
                ? `${hrefCheck() ? 'bg-[#7A7A7A]' : `${isPressed ? 'bg-[#7A7A7A]' : 'bg-gray-600'}`} text-white text-xl p-2`
                : `${hrefCheck() ? 'bg-gray-600' : `${isPressed ? 'bg-gray-600' : 'bg-[#7A7A7A]'}`} text-black text-3xl p-3`}`}
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
            {(isPressed || hrefCheck()) && props.subsections}
        </div>
    );
}

export default NavigatorButton;