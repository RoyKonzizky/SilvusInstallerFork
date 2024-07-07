import {useState} from 'react';
import HyperModal from "react-hyper-modal";
import {TopologySettingsTable} from "./TopologySettingsTable.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store.ts";
import settingsIcon from "../../../../../assets/settingsIconTopology.svg";
import {useTranslation} from 'react-i18next';

export function TableModal() {
    const [modalState, setModalState] = useState(false);
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const groups = selector.hullOptions.map((hull) => hull.id);
    const {t} = useTranslation();

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    return (
        <div>
            <button className={'text-black w-20 h-24 rounded'} onClick={openModal}>
                <img className={'bg-white rounded-full'} src={settingsIcon} alt={t("settings")}/>
            </button>
            <HyperModal isOpen={modalState} requestClose={closeModal}>
                <TopologySettingsTable resetOnClose={modalState} groups={groups === undefined ? groups : []}
                                       nodes={selector.nodes}/>
            </HyperModal>
        </div>
    );
}
