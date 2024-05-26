import { useState } from 'react';
import HyperModal from "react-hyper-modal";
import settingsIcon from "../../../../../assets/settingsIconTopology.svg";
import {IUserEdge, IUserNode} from "@antv/graphin";
import {TopologySettingsTable} from "./TopologySettingsTable.tsx";

interface ITableModal {
    graphData: { nodes: IUserNode[], edges: IUserEdge[]},
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
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*// @ts-ignore*/}
                <TopologySettingsTable groups={["combo-1", "combo-2"]} nodes={props.graphData.nodes} />
            </HyperModal>
        </div>
    );
}
