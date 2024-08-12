import {Button, Popover} from "antd";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {Battery} from "./Battery.tsx";
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store.ts";
import {updateNodes} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {ChangeEvent, useState} from "react";
import refreshIcon from "../../../../../assets/refresh.svg";
import { updateBatteryInfo } from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import {
    sendNames
} from "../../../../../../../local_app_build/Lizi-win32-x64/resources/app/src/renderer/utils/topologyUtils/elementPopoverUtils.ts";
import {
    connectCamToDevice
} from "../../../../../../../local_app_build/Lizi-win32-x64/resources/app/src/renderer/utils/topologyUtils/getCamerasButtonUtils.ts";

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
                return { ...node, style: { ...node.style, label: { ...node.style?.label, value: newLabel, }, }, };
            }
            return node;
        });
        dispatch(updateNodes(newNodes));
    };

    const handleButtonClick = () => {
        sendNames(
            props.selectedElement?.id as string,
            props.selectedElement?.style?.label?.value as string
        );
    };

    return (
        props.selectedElement?.type === 'graphin-circle' ?
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
                                     <div className={'flex flex-row items-center focus:outline-none'}>
                                         <input className={"text-xl w-48 bg-white "} onChange={handleLabelChange}
                                                value={label || ''}/>
                                         <Button onClick={handleButtonClick}>V</Button>
                                     </div>
                                     <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                         <Battery voltage={Math.round(props.selectedElement?.data.battery)} />
                                         <button onClick={() => updateBatteryInfo(props.selectedElement?.id, dispatch)}>
                                             <img src={refreshIcon} alt={'refresh battery'} style={{ width: '1.2rem' }}
                                                 className={props.selectedElement?.data.battery === -1
                                                     ? 'rotate-animation' : ''}/>
                                         </button>
                                     </div>
                                     <p>{`IP: ${props.selectedElement?.data.ip}`}</p>
                                     <p>
                                         {`${t('cameraMainStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement.data.ip, selector.cameras).mainStreamLink
                                         || 'N/A'}`}
                                     </p>
                                     <p>
                                         {`${t('cameraSubStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement.data.ip, selector.cameras).subStreamLink 
                                         || 'N/A'}`}
                                     </p>
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
            :
            null
    );
}
