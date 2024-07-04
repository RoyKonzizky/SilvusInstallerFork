import {Popover} from "antd";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {Battery} from "./Battery.tsx";
import {useTranslation} from 'react-i18next';
import {useState} from 'react';

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null,
    position: { x: number, y: number },
    onClose: () => void,
    onLabelChange: (nodeId: string, newLabel: string) => void,
}

export function ElementPopover(props: IElementPopoverProps) {
    const {t} = useTranslation();
    const [newLabel, setNewLabel] = useState('');

    const handleLabelSubmit = () => {
        if (props.selectedElement?.type === 'graphin-circle' && props.selectedElement?.id) {
            props.onLabelChange(props.selectedElement.id, newLabel);
            props.onClose();
        }
    };

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
                                 <input
                                     type="text"
                                     value={newLabel}
                                     onChange={(e) => setNewLabel(e.target.value)}
                                     placeholder={t('newLabel')}
                                     className="mt-2"
                                 />
                                 <button onClick={handleLabelSubmit} className="mt-2">
                                     {t('changeLabel')}
                                 </button>
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
