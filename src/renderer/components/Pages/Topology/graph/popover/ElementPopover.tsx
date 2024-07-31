import { Popover } from "antd";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { Battery } from "./Battery.tsx";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { updateNodes } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {ChangeEvent, useState} from "react";
import {sendNames} from "../../../../../utils/topologyUtils/elementPopoverUtils.ts";

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null,
    position: { x: number, y: number },
    onClose: () => void,
}

export function ElementPopover(props: IElementPopoverProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [label, setLabel] =
        useState(props.selectedElement?.style?.label?.value);
    const [isClicked, setIsClicked] = useState(false);

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
        const newLabel = e.target.value;
        const newNodes = selector.nodes.map(node => {
            if (node.id === props.selectedElement?.id) {
                return {...node, style: {...node.style, label: {...node.style?.label, value: newLabel,},},};
            }
            return node;
        });
        dispatch(updateNodes(newNodes));
    };


    const handleButtonClick = () => {
        setIsClicked(true);
        sendNames(
            props.selectedElement?.id as string,
            props.selectedElement?.style?.label?.value as string
        );

        setTimeout(() => setIsClicked(false), 200);
    };

    return (
        <Popover title={t('elementDetails')} placement={"top"} arrow={false} open={!!props.selectedElement}
                 getPopupContainer={trigger => trigger.parentElement!}
                 overlayStyle={{
                     height: '75px', position: 'absolute',
                     top: (!isNaN(props.position.y)) ? props.position.y : 100,
                     left: (!isNaN(props.position.x)) ? props.position.x : 0,
                 }}
                 content={
                     <div>
                         {props.selectedElement?.type === 'graphin-circle' ?
                             <div>
                                 <div className={'flex flex-row items-center'}>
                                     <input className={"text-xl w-48"} onChange={handleLabelChange} value={label || ''}/>
                                     <button onClick={handleButtonClick}
                                         className={`bg-gray-900 w-9 h-9 text-white font-bold py-2 px-4 rounded-full ${
                                             isClicked ? 'opacity-50' : 'opacity-100'
                                         } focus:outline-none z-50 flex justify-center items-center ml-2`}>V
                                     </button>
                                 </div>
                                 <Battery voltage={Math.round(props.selectedElement?.data.battery)} />
                                 <p>{`IP: ${props.selectedElement?.data.ip}`}</p>
                                 <p>{`${t('cameraMainStreamLink')}: ${props.selectedElement.data.camLinks.mainStreamLink || 'N/A'}`}</p>
                                 <p>{`${t('cameraSubStreamLink')}: ${props.selectedElement.data.camLinks.subStreamLink || 'N/A'}`}</p>
                             </div>
                             :
                             <p>{`SNR = ${props.selectedElement?.data}`}</p>
                         }
                         <button onClick={props.onClose}
                             className={'bg-gray-900 w-9 h-9 focus:opacity-75 text-white font-bold py-2 px-4 rounded' +
                                 'focus:outline-none z-50 flex justify-center absolute top-2 right-2 round'}>X
                         </button>
                     </div>
                 }
        />
    );
}
