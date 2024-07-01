import {Popover} from "antd";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {Battery} from "./Battery.tsx";
import {useTranslation} from 'react-i18next';

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null,
    position: { x: number, y: number },
    onClose: () => void,
}

export function ElementPopover(props: IElementPopoverProps) {
    const {t} = useTranslation();

    return (
        <Popover title={t('elementDetails')} placement={"top"} arrow={false} open={!!props.selectedElement}
                 getPopupContainer={trigger => trigger.parentElement!}
                 overlayStyle={{
                     height: '75px', position: 'absolute',
                     top: (!isNaN(props.position.y)) ? props.position.y : 100,
                     left: (!isNaN(props.position.x)) ? props.position.x : 0,
                     // transform: 'translate(-50%, -100%)'
                 }}
                 content={
                     <div>
                         {props.selectedElement?.type === 'graphin-circle' ?
                             <div>
                                 <p className={"text-xl"}>{`${t('id')}: ${props.selectedElement?.id}`}</p>
                                 <Battery voltage={Math.round(props.selectedElement?.data.battery)} />
                             </div>
                             :
                             <p>{`SNR = ${props.selectedElement?.data}`}</p>
                         }
                         <button
                             className={'bg-gray-900 w-9 h-9 focus:opacity-75 text-white font-bold py-2 px-4 rounded' +
                                 'focus:outline-none z-50 flex justify-center absolute top-2 right-2 round'} onClick={props.onClose}>X
                         </button>
                     </div>
                 }
        />
    );
}
