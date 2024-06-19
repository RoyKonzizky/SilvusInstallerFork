import {useState} from 'react';
import HyperModal from "react-hyper-modal";
import settingsIcon from '../../../../../assets/settingsIconTopology.svg';
import {IUserEdge, IUserNode} from "@antv/graphin";
import {TopologySettingsTable} from "./TopologySettingsTable.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store.ts";

interface ITableModal {
    graphData: { nodes: IUserNode[], edges: IUserEdge[] },
}

export function TableModal(props: ITableModal) {
    const [modalState, setModalState] = useState(false);
    const hullsFromSelector = useSelector((state: RootState) => state.topologyGroups.hullOptions);
    const groups = hullsFromSelector.map((hull) => hull.id);

    const openModal = () => setModalState(true);
    const closeModal = () => setModalState(false);

    return (
        <div>
            <button className={'text-black absolute z-50 left-1 top-1 w-20 h-24 rounded'} onClick={openModal}>
                <img className={'bg-white rounded-full'} src={settingsIcon} alt={"settings"}/>
            </button>
            <HyperModal isOpen={modalState} requestClose={closeModal}>
                <TopologySettingsTable resetOnClose={modalState} groups={groups === undefined ? groups : []}
                                       nodes={props.graphData.nodes}/>
            </HyperModal>
        </div>
    );
}
