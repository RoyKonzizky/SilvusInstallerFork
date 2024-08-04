import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";
import TopologyLayoutModal from "./TopologyLayoutModal.tsx";

export function TopologyTopBar() {
    return (
        <div className={'flex flex-col absolute top-10 left-10 z-50'}>
            <TableModal />
            {/* <TopologyLayoutModal /> */}
            <LegendSnr />
        </div>
    );
}
