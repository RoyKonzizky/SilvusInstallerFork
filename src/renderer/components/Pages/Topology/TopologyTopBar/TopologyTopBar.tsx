import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";

export function TopologyTopBar() {
    return (
        <div className={'flex flex-row absolute top-0 left-0 z-50'}>
            <TableModal />
            <LegendSnr />
        </div>
    );
}
