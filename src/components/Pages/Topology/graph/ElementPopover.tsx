import {Popover} from "antd";
import {IUserEdge, IUserNode} from "@antv/graphin";

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null;
    position: { x: number, y: number };
    onClose: () => void;
}

export function ElementPopover(props: IElementPopoverProps) {
    return (
        <Popover title="Element Details" placement={"top"} arrow={false} open={!!props.selectedElement}
                 getPopupContainer={trigger => trigger.parentElement!}
                 overlayStyle={{top: (!isNaN(props.position.y)) ? props.position.y : 100, left: props.position.x,
                     height: '75px', position: 'absolute',
                     // transform: 'translate(-50%, -100%)'
                 }}
                 content={
                     <div>
                         <p>{`This is the content of the popover for ${props.selectedElement?.id}`}</p>
                         <button
                             className={"bg-gray-900 w-9 h-9 focus:opacity-75 text-white font-bold py-2 px-4 rounded " +
                                 "focus:outline-none z-50 flex justify-center"} onClick={props.onClose}>X
                         </button>
                     </div>
                 }
        />
    );
}
