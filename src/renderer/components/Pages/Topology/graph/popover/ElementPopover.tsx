import { Popover } from "antd";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { Battery } from "./Battery.tsx";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { updateNodes } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {ChangeEvent, useEffect, useState} from "react";
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

    useEffect(() => {
        sendNames(props.selectedElement?.id, props.selectedElement?.style?.label?.value as string);
    }, [label])

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
                                 <input className={"text-xl"} onChange={handleLabelChange} value={label}/>
                                 <Battery voltage={Math.round(props.selectedElement?.data.battery)} />
                                 <p>{`IP: ${props.selectedElement?.data.ip}`}</p>
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
