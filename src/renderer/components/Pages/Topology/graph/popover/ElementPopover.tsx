import { Button, Popover } from "antd";
import { IUserEdge, IUserNode } from "@antv/graphin";
import { Battery } from "./Battery.tsx";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store.ts";
import { updateNodes } from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {ChangeEvent, useEffect, useState} from "react";
import refreshIcon from "../../../../../assets/refresh.svg";
import { updateBatteryInfo } from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { sendNames } from "../../../../../utils/topologyUtils/elementPopoverUtils.ts";
import {CamStreams, connectCamToDevice} from "../../../../../utils/topologyUtils/getCamerasButtonUtils.ts";

interface IElementPopoverProps {
    selectedElement: IUserNode | IUserEdge | null,
    position: { x: number, y: number },
    onClose: () => void,
}

export function ElementPopover(props: IElementPopoverProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [label, setLabel] = useState(props.selectedElement?.style?.label?.value);
    const [camLinks, setCamLinks] = useState<CamStreams>();

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

    const handleLabelEditButtonClick = () => {
        sendNames(
            props.selectedElement?.id as string,
            props.selectedElement?.style?.label?.value as string
        );
        setIsEditMode(false);
    };

    useEffect(() => {
        setCamLinks({
            mainStreamLink: `${t('cameraMainStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement!.data.ip, selector.cameras).mainStreamLink}`,
            subStreamLink: `${t('cameraSubStreamLink')}: 
                                         ${connectCamToDevice(props.selectedElement!.data.ip, selector.cameras).subStreamLink}`
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
                                    <input
                                        onChange={handleLabelChange}
                                        value={label || ''}
                                        style={{
                                            padding: '0.3rem',
                                            border: '2px solid #ccc',
                                            borderRadius: '5px',
                                            fontSize: '1.2rem',
                                            width: '55%',
                                            height: '2.5rem',
                                            backgroundColor: 'white',
                                        }}
                                        className={'bg-white'}
                                        onFocus={() => setIsEditMode(true)}
                                        onBlur={() => setIsEditMode(false)}
                                    />
                                    <Button
                                        onClick={handleLabelEditButtonClick}
                                        style={{
                                            marginLeft: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            border: '2px solid #007bff',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            borderRadius: '4px',
                                            fontSize: '1rem',
                                            height: '2.4rem',
                                            visibility: isEditMode ? 'visible' : 'hidden'
                                        }}>
                                        {t('updateDeviceLabelButton')}
                                    </Button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <Battery voltage={Math.round(props.selectedElement?.data.battery)} />
                                    <button onClick={() => updateBatteryInfo(props.selectedElement?.id, dispatch)}>
                                        <img src={refreshIcon} alt={'refresh battery'} style={{ width: '1.2rem' }}
                                            className={props.selectedElement?.data.battery === '-1' ? 'rotate-animation' : ''}
                                        />
                                    </button>
                                </div>
                                <p>{`IP: ${props.selectedElement?.data.ip}`}</p>
                                <p>
                                    {camLinks?.mainStreamLink}
                                </p>
                                <p>
                                    {camLinks?.subStreamLink}
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
