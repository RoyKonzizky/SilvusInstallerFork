import {TableModal} from "./topologyTable/TableModal.tsx";
import {DisplaySettingsPanel} from "./DisplaySettingsPanel.tsx";
import {Dispatch, SetStateAction} from "react";
// import {GetCamerasButton} from "./GetCamerasButton.tsx";
// import TopologyLayoutModal from "./TopologyLayoutModal.tsx";

interface ITopologyTopBar {
    setBackgroundImage: Dispatch<SetStateAction<string | null>>
}

export function TopologyTopBar(props: ITopologyTopBar) {
    return (
        <div className={'flex flex-col absolute top-10 left-6 z-50'}>
            <TableModal />
            {/* <TopologyLayoutModal /> */}
            <DisplaySettingsPanel setBackgroundImage={props.setBackgroundImage} />
            {/*<GetCamerasButton />*/}
        </div>
    );
}
