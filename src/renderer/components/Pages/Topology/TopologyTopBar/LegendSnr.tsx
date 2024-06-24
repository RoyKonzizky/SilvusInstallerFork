import { useState } from "react";
import {Modal} from "antd";
import {snrColors} from "../../../../utils/topologyUtils/LegendSnrUtils.ts";
import legendsIcon from "../../../../assets/snrLegendIcon.png";
import { useTranslation } from 'react-i18next';

export function LegendSnr() {
    const [modalState, setModalState] = useState(false);
    const { t, } = useTranslation();

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    return (
        <div>
            <button className={'text-black h-14 w-14 m-5 rounded-xl'} onClick={openModal}>
                <img className={'bg-black rounded-full border-white border'} src={legendsIcon} alt={t("settings")} />
            </button>
            <Modal closable={true} centered={true} open={modalState} afterClose={closeModal} onCancel={closeModal}
                   title={t('SNRLegend')} footer={null}>
                <div className={'p-4 bg-white rounded'}>
                    {snrColors(t).map((value, index) => (
                        <div key={index} className={'flex items-center mb-2'}>
                            <p className={'text-l text-black mr-2'}>{value.explanation}</p>
                            <div className={`w-6 h-6 ${value.color}`}></div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
