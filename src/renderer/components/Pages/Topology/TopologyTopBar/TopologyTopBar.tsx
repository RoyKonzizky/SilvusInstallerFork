import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";
import {GetCamerasButton} from "./GetCamerasButton.tsx";

export function TopologyTopBar() {
    return (
        <div className={'flex flex-row absolute top-0 left-0 z-50'}>
            <TableModal />
            <LegendSnr />
            <GetCamerasButton />
        </div>
    );
}
