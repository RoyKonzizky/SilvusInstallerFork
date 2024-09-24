import { useEffect, useState } from "react";
import { Modal, Slider, Button } from "antd";
import { snrColors } from "../../../../utils/topologyUtils/LegendSnrUtils.ts";
import { useTranslation } from 'react-i18next';
import connectivityIcon from "../../../../assets/connectivity.svg";
import { getDataInterval, updateDataInterval } from "../../../../utils/topologyUtils/settingsTableUtils.tsx";
import { toast } from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";
import {updateNodes} from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {IUserNode} from "@antv/graphin";

export function DisplaySettingsPanel() {
    const DEFAULT_DATA_INTERVAL_VALUE = 2;
    const DEFAULT_LABEL_SIZE_INTERVAL_VALUE = 1;
    const dispatch = useDispatch();
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const [modalState, setModalState] = useState(false);
    const { t, i18n } = useTranslation();
    const [dataIntervalValue, setDataIntervalValue] = useState<number>(DEFAULT_DATA_INTERVAL_VALUE);
    const [labelSizeIntervalValue, setLabelSizeIntervalValue] = useState(DEFAULT_LABEL_SIZE_INTERVAL_VALUE);

    useEffect(() => {
        (async () => {
            const interval = await getDataInterval();
            setDataIntervalValue(interval ?? DEFAULT_DATA_INTERVAL_VALUE);
        })();
    }, []);

    const handleApplyDataIntervalButtonClicked = async () => {
        const updatedValue = await updateDataInterval(dataIntervalValue);
        if (updatedValue) {
            toast.success(t("dataIntervalUpdateSuccessMsg"));
            setModalState(false);
            return;
        }
        toast.error(t("dataIntervalUpdateFailureMsg"));
    }

    const increaseNodesLabelSize = (nodes:IUserNode[], labelSizeIntervalValue: number) => {
        const updatedNodes:IUserNode[] = nodes.map(node => {
            const newSize = node.style!.label!.fontSize! * labelSizeIntervalValue;
            return {
                ...node,
                style: {
                    ...node.style,
                    label:{
                        ...node.style?.label,
                        fontSize: newSize,
                    }
                }
            };
        });
        return updatedNodes;
    }

    const handleApplyLabelSizeButtonClicked = async () => {
        const nodes = nodesSelector;
        const updatedNodes = increaseNodesLabelSize(nodes, labelSizeIntervalValue);
        dispatch(updateNodes(updatedNodes));
        setModalState(false);
        if (updatedNodes[0].style?.label?.fontSize === nodes[0].style!.label!.fontSize! * labelSizeIntervalValue) {
            toast.success(t("NodeLabelSizeSuccess"));
            setModalState(false);
            return;
        }
        toast.error(t("NodeLabelSizeFailure"));
    }

    return (
        <div>
            <button className={'text-black h-14 w-14 mt-5 rounded-xl'} onClick={() => setModalState(true)}>
                <img className={'bg-black p-2 rounded-full border-white border'} src={connectivityIcon} alt={t("settings")} />
            </button>
            <Modal
                open={modalState}
                centered={true}
                className={`flex ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end"}`}
                title={
                    <div style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
                        {t('connectivityLevelHeader')}
                    </div>
                }
                footer={null}
                closable={true}
                onCancel={() => setModalState(false)}
                afterClose={() => setModalState(false)}
            >
                <div style={{ padding: '3rem 0' }}>
                    <Slider
                        min={2}
                        max={10}
                        step={2}
                        value={dataIntervalValue}
                        onChange={(newValue) => setDataIntervalValue(newValue)}
                        marks={{ 2: '2', 4: '4', 6: '6', 8: '8', 10: '10' }}
                        tooltip={{ open: false }}
                        style={{ width: '85%', margin: 'auto' }}
                    />

                    <div className="flex justify-center">
                        <Button
                            onClick={handleApplyDataIntervalButtonClicked}
                            className={'text-black h-10 w-30 mt-10 rounded-xl'}
                        >
                            {t("ApplySettings")}
                        </Button>
                    </div>
                </div>

                <hr style={{ paddingBottom: '1rem' }} />

                <div style={{ direction: i18n.language === 'en' ? "ltr" : "rtl" }}>
                    {t('SNRLegend')}
                </div>
                <div className={'p-4 bg-white rounded'}>
                    {snrColors(t).map((value, index) => (
                        <div key={index} className={`flex items-center mb-2 ${i18n.language === 'en' && "text-start"} ${i18n.language === 'he' && "justify-end"}`}>
                            {i18n.language === 'en' && <div className={`w-6 h-6 ${value.color}`}></div>}
                            <p className={`text-l text-black mr-2 ml-2`}>{value.explanation}</p>
                            {i18n.language === 'he' && <div className={`w-6 h-6 ${value.color}`}></div>}
                        </div>
                    ))}
                </div>

                <div style={{ padding: '3rem 0' }}>
                    <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={labelSizeIntervalValue}
                        onChange={(newValue) => setLabelSizeIntervalValue(newValue)}
                        marks={{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }}
                        tooltip={{ open: false }}
                        style={{ width: '85%', margin: 'auto' }}
                    />

                    <div className="flex justify-center">
                        <Button
                            onClick={handleApplyLabelSizeButtonClicked}
                            className={'text-black h-10 w-30 mt-10 rounded-xl'}
                        >
                            {t("ApplySettings")}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
