import { useState } from 'react';
import HyperModal from "react-hyper-modal";
import { SettingsTable } from './SettingsTable'; // Make sure to import SettingsTable if it's used in the ModalComponent
import settingsIcon from "../../../assets/settingsIconTopology.svg";
import {NodeConfig} from "@antv/g6-core/lib/types";
import {EdgeConfig} from "@antv/g6";

interface ITableModal {
    graphData: { nodes: NodeConfig[], edges: EdgeConfig[] },
}

export function TableModal(props:ITableModal) {
    const [modalState, setModalState] = useState(false);

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    return (
        <div>
            <button className={"text-black absolute z-50 left-1 top-1 w-20 h-24 rounded"} onClick={openModal}>
                <img className={"bg-white rounded-full"} src={settingsIcon} alt={"settings"}/>
            </button>
            <HyperModal isOpen={modalState} requestClose={closeModal}>
                <SettingsTable groups={[]} nodes={props.graphData.nodes} />
            </HyperModal>
        </div>
    );
}
