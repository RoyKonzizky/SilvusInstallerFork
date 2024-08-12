import { useState } from "react";
import { Modal, Slider } from "antd";
import { snrColors } from "../../../../utils/topologyUtils/LegendSnrUtils.ts";
import { useTranslation } from 'react-i18next';
import connectivityIcon from "../../../../assets/connectivity.svg";
import { Button } from "antd";

export function LegendSnr() {
    const DEFAULT_INTERVAL_VALUE = 2;

    const [modalState, setModalState] = useState(false);
    const { t, i18n } = useTranslation();

    const [intervalValue, setIntervalValue] = useState<number>(DEFAULT_INTERVAL_VALUE);

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
                        value={intervalValue}
                        onChange={(newValue) => setIntervalValue(newValue)}
                        marks={{ 2: '2', 4: '4', 6: '6', 8: '8', 10: '10' }}
                        tooltip={{ open: false }}
                        style={{ width: '85%', margin: 'auto' }}
                    />

                    <div className="flex justify-center">
                        <Button
                            onClick={() => {
                                // TODO add by api
                                setModalState(false);
                            }}
                            className={'text-black h-10 w-30 mt-10 rounded-xl'}
                        >
                            {t("Apply")}
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
            </Modal>
        </div>
    );
}
