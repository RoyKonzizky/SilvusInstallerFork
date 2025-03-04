import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Button, Modal, Slider} from "antd";
import {useTranslation} from 'react-i18next';
import connectivityIcon from "../../../../../assets/connectivity.svg";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {ImageImport} from "./ImageImport.tsx";
import {RootState} from "../../../../../redux/store.ts";
import {getDataInterval, updateDataInterval} from "../../../../../utils/topologyUtils/settingsTableUtils.tsx";
import {setSizeInterval, updateEdges, updateNodes} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {snrColors} from "../../../../../utils/topologyUtils/LegendSnrUtils.ts";
import {ExportGraph} from "../GraphPositionsSave/ExportGraph.tsx";
import {ImportGraph} from "../GraphPositionsSave/ImportGraph.tsx";

interface IDisplaySettingsPanel {
    setBackgroundImage: Dispatch<SetStateAction<string | null>>
}

export function DisplaySettingsPanel(props: IDisplaySettingsPanel) {
    const DEFAULT_DATA_INTERVAL_VALUE = 2;
    const dispatch = useDispatch();
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [modalState, setModalState] = useState(false);
    const { t, i18n } = useTranslation();
    const [dataIntervalValue, setDataIntervalValue] = useState<number>(DEFAULT_DATA_INTERVAL_VALUE);
    const [sizeIntervalValue, setSizeIntervalValue] = useState<number>(selector.sizeInterval);

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

    const increaseElementsSize = (nodes:IUserNode[], edges: IUserEdge[], sizeIntervalValue: number) => {
        const DEFAULT_NODE_FONT_SIZE = 30;
        const DEFAULT_NODE_SHAPE_SIZE = 50;
        const DEFAULT_EDGE_FONT_SIZE = 30;
        const DEFAULT_EDGE_SHAPE_SIZE = 6;
        const updatedNodes:IUserNode[] = nodes.map(node => {
            return {
                ...node,
                style: {
                    ...node.style,
                    label:{
                        ...node.style?.label,
                        fontSize: DEFAULT_NODE_FONT_SIZE * sizeIntervalValue,
                    },
                    keyshape: {
                        ...node.style?.keyshape,
                        size: DEFAULT_NODE_SHAPE_SIZE * sizeIntervalValue,
                    },
                }
            };
        });

        const updatedEdges: IUserEdge[] = edges.map(edge => {
            return {
                ...edge,
                style: {
                    ...edge.style,
                    label: {
                        ...edge.style?.label,
                        fontSize: DEFAULT_EDGE_FONT_SIZE * sizeIntervalValue,
                    },
                    keyshape: {
                        ...edge.style?.keyshape,
                        lineWidth: DEFAULT_EDGE_SHAPE_SIZE * sizeIntervalValue
                    },
                },
            };
        });

        return {updatedNodes, updatedEdges};
    }

    const handleApplyLabelSizeButtonClicked = async () => {
        const updatedGraphData = increaseElementsSize(selector.nodes, selector.edges, sizeIntervalValue);
        dispatch(updateNodes(updatedGraphData.updatedNodes));
        dispatch(updateEdges(updatedGraphData.updatedEdges));
        dispatch(setSizeInterval(sizeIntervalValue));
        setModalState(false);
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
                title={''}
                footer={null}
                closable={true}
                onCancel={() => setModalState(false)}
                afterClose={() => setModalState(false)}
            >
                <div style={{ padding: '3rem 0' }}>
                    <div className={"text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2"} style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
                        {t('connectivityLevelHeader')}
                    </div>
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

                <div className={"text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2"} style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
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

                <hr style={{ paddingBottom: '1rem' }} />

                <div style={{ padding: '3rem 0' }}>
                    <div className={"text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2"} style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
                        {t("nodeLabelSizeSlider")}
                    </div>
                    <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={sizeIntervalValue}
                        onChange={(newValue) => setSizeIntervalValue(newValue)}
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

                <hr style={{ paddingBottom: '1rem' }} />

                <div style={{ padding: '3rem 0' }}>
                    <div className={"text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2"} style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
                        {t('saveGraph')}
                    </div>

                    <div className={'flex justify-center h-24'}>
                        <ExportGraph />
                        <ImportGraph />
                    </div>
                </div>

                <hr style={{ paddingBottom: '1rem' }} />

                <div style={{ padding: '3rem 0' }}>
                    <div className={"text-2xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2"} style={i18n.language === 'he' ? { textAlign: "right", paddingRight: "2rem" } : {}}>
                        {t('importImage')}
                    </div>

                    <div className={'flex relative left-40 h-24'}>
                        <ImageImport setBackgroundImage={props.setBackgroundImage}/>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
