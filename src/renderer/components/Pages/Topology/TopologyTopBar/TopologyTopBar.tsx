import { TableModal } from "./topologyTable/TableModal.tsx";
import { LegendSnr } from "./LegendSnr.tsx";

interface ITopologyTopBar {
    isSmaller: boolean,
}

export function TopologyTopBar(props: ITopologyTopBar) {
    return (
        <div className={'flex flex-row absolute top-0 left-0 z-50'}>
            <TableModal isSmaller={props.isSmaller} />
            <LegendSnr />
        </div>
    );
}
