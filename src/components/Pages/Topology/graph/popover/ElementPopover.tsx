import { Button, Popover } from "antd";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { Battery } from "./Battery.tsx";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { updateNodes } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {ChangeEvent, useEffect, useState} from "react";
import { sendNames } from "../../../../../utils/topologyUtils/elementPopoverUtils.ts";
import {CamStreams, connectCamToDevice} from "../../../../../utils/topologyUtils/getCamerasButtonUtils.ts";
import {PopoverBatteryRefreshSpinner} from "./PopoverBatteryRefreshSpinner.tsx";
import hideNodesIcon from "../../../../../assets/hideNodesIcon.svg";
import {hideNode} from "../../../../../utils/topologyUtils/hideNodesModalUtils.ts";

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null,
    position: { x: number, y: number },
    onClose: () => void,
}

export function ElementPopover(props: IElementPopoverProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selectorTopology = useSelector((state: RootState) => state.topologyGroups);
    const selectorIP = useSelector((state: RootState) => state.ip);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [label, setLabel] = useState(props.selectedElement?.style?.label?.value);
    const [camLinks, setCamLinks] = useState<CamStreams>();
    const [elementBattery, setElementBattery] = useState<string>(props.selectedElement?.data.battery);
    const [nodes, setNodes] = useState(selectorTopology.nodes);

    const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
        const newLabel = e.target.value;
        const newNodes = selectorTopology.nodes.map(node => {
            if (node.id === props.selectedElement?.id) {
                return { ...node, style: { ...node.style, label: { ...node.style?.label, value: newLabel, }, }, };
            }
            return node;
        });
        setNodes(newNodes);
    };

    const handleLabelEditButtonClick = () => {
        //Moved to this format to make sure nothing updates if the server isn't updated
        try {
            sendNames(
                props.selectedElement?.id as string,
                label as string //Changed to the label to make sure it updates correctly
            );
            dispatch(updateNodes(nodes));
        } catch (e) {
            console.error(e, 'Name change failed');
        } finally {
            setIsEditMode(false);
        }
    };

    useEffect(() => {
        setCamLinks({
            mainStreamLink: `${t('cameraMainStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement!.data.ip, selectorTopology.cameras).mainStreamLink}`,
            subStreamLink: `${t('cameraSubStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement!.data.ip, selectorTopology.cameras).subStreamLink}`
        });
    }, []);

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
                                <div className={'flex flex-row items-center focus:outline-none mb-2 mt-3'}>
                                    <input className={"p-1.5 border-2 border-gray-300 rounded-md text-lg " +
                                        "w-11/20 h-10 bg-white focus:ring focus:ring-blue-300"} value={label || ''}
                                           onChange={handleLabelChange} onFocus={() => setIsEditMode(true)}
                                           onBlur={() => setIsEditMode(false)}
                                    />
                                    <Button onClick={handleLabelEditButtonClick}
                                        className={`ml-2 py-2 px-4 border-2 text-white rounded-md text-base h-10 transition-all 
                                        ${isEditMode ? 'border-blue-500 bg-blue-500' : 'invisible'}`}
                                    >
                                        {t('updateDeviceLabelButton')}
                                    </Button>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Battery voltage={Math.round(Number(elementBattery))} />
                                    <PopoverBatteryRefreshSpinner elementBattery={elementBattery} dispatch={dispatch}
                                        setElementBattery={setElementBattery} deviceId={props.selectedElement.id}/>
                                </div>

                                <p>{`IP: ${props.selectedElement?.data.ip}`}</p>
                                <p>
                                    {camLinks?.mainStreamLink}
                                </p>
                                <p>
                                    {camLinks?.subStreamLink}
                                </p>
                                <Button disabled={selectorIP.ip_address === props.selectedElement!.data.ip} className={'h-14 w-14 mt-5 rounded-full border border-white bg-black'}
                                        onClick={()=>hideNode(props.selectedElement as IUserNode)}>
                                    <img className={'rounded-full h-14 w-14'} src={hideNodesIcon} alt={t("hideNodes")} />
                                </Button>
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
