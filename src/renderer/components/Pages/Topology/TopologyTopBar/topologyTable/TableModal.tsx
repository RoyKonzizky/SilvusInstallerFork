import {useState} from 'react';
import HyperModal from "react-hyper-modal";
import {TopologySettingsTable} from "./TopologySettingsTable.tsx";
import settingsIcon from "../../../../../assets/settingsIconTopology.svg";
import {useTranslation} from 'react-i18next';

interface ITableModal {
    isSmaller: boolean,
}

export function TableModal(props: ITableModal) {
    const [modalState, setModalState] = useState(false);
    const {t} = useTranslation();

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    return (
        <div>
            <button className={'text-black w-20 h-24 rounded'} onClick={openModal}>
                <img className={'bg-white rounded-full'} src={settingsIcon} alt={t("settings")}/>
            </button>
            <HyperModal closeOnCloseIconClick={true} closeIconPosition={{}} isOpen={modalState} requestClose={closeModal}>
                <TopologySettingsTable resetOnClose={modalState} isSmaller={props.isSmaller}/>
            </HyperModal>
        </div>
    );
}
