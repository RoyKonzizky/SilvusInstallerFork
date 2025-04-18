import { INavigatorButtonProps } from "./INavigatorButtonProps.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";

function NavigatorButton(props: INavigatorButtonProps) {
    const navigate = useNavigate(); // Get the navigate function from the router context
    const { origin, href } = window.location;
    const [mirroredImage, setMirroredImage] = useState('');
    const [isPressed, setPressed] = useState(false);
    const isSidebarCollapsed = useSelector((state: RootState) => state.collapsing.isSidebarCollapsed);

    function hrefCheck() {
        return href === origin + props.href || (props.subsections && props.possibleHrefSubsections?.some(subsection => href === `${origin}${subsection}`));
    }

    return (
        <div
            onClick={() => {
                setPressed(!isPressed);
                if (props.onClick) {
                    props.onClick();
                    setMirroredImage(isSidebarCollapsed ? 'scale-x-[-1]' : '')
                }
                if (props.href !== "") {
                    navigate(props.href);
                    const res = hrefCheck();
                    setPressed(res ? res : false);
                }
            }}
            className={`flex mt-3 mb-3 rounded-xl cursor-pointer ${props.isSubsection
                ? `${hrefCheck() ? 'bg-[#7A7A7A]' : `${isPressed && props.file ? 'bg-[#7A7A7A]' : 'bg-gray-600'}`} text-white text-xl p-2`
                : `${hrefCheck() ? 'bg-gray-600' : `${isPressed && props.file ? 'bg-gray-600' : 'bg-[#7A7A7A]'}`} text-black text-3xl p-3`}`}
        >
            <div className="flex justify-center items-center m-auto">
                {
                    <p style={{ width: (!isSidebarCollapsed && props.text && props.file) ? '200px' : 0, transition: 'width 0.3s ease', overflow: 'hidden' }}>
                        {props.text}
                    </p>
                }
                {props.file ?
                    <img
                        className={`${props.isSubsection ? 'h-12 w-12' : 'h-16 w-16'} ${mirroredImage}`}
                        src={props.file} alt=""
                    />
                    : <div className="flex items-center text-white">{props.text}</div>}
            </div>
            {(isPressed || hrefCheck()) && props.subsections}
        </div>
    );
}

export default NavigatorButton;