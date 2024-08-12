import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";
import {GetCamerasButton} from "./GetCamerasButton.tsx";
// import TopologyLayoutModal from "./TopologyLayoutModal.tsx";

export function TopologyTopBar() {
    return (
        <div className={'flex flex-col absolute top-0 z-50'}>
            <TableModal />
            {/* <TopologyLayoutModal /> */}
            <LegendSnr />
            <GetCamerasButton />
        </div>
    );
}
