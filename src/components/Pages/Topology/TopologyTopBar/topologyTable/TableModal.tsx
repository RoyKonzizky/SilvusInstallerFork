import { useState } from 'react';
import HyperModal from "react-hyper-modal";
import { TopologySettingsTable } from "./TopologySettingsTable.tsx";
import settingsIcon from "../../../../../assets/settingsIconTopology.svg";
import { useTranslation } from 'react-i18next';
import { sendPttGroups } from '../../../../../utils/topologyUtils/settingsTableUtils.tsx';
import { HullCfg, IUserNode } from '@antv/graphin';

export function TableModal() {
    const [modalState, setModalState] = useState(false);
    const { t } = useTranslation();

    return (
        <div>
            <button className={'h-14 w-14 mt-5 rounded-full border border-white'} onClick={() => setModalState(true)}>
                <img className={'bg-white rounded-full'} src={settingsIcon} alt={t("settings")} />
            </button>
            <HyperModal isOpen={modalState} requestClose={() => setModalState(false)}>
                <TopologySettingsTable
                    onSave={(hulls: HullCfg[], nodes: IUserNode[]) => {
                        sendPttGroups(hulls, nodes);
                        setModalState(false);
                    }}
                    resetOnClose={modalState}
                />
            </HyperModal>
        </div>
    );
}