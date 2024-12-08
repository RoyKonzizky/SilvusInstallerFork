import { TableModal } from "./topologyTable/TableModal.tsx";
import { DisplaySettingsPanel } from "./DisplaySettingsPanel.tsx";
import {ExportGraph} from "./GraphPositionsSave/ExportGraph.tsx";
import {ImportGraph} from "./GraphPositionsSave/ImportGraph.tsx";
// import {GetCamerasButton} from "./GetCamerasButton.tsx";
// import TopologyLayoutModal from "./TopologyLayoutModal.tsx";

export function TopologyTopBar() {
    return (
        <div className={'flex flex-col absolute top-10 left-6 z-50'}>
            <TableModal />
            {/* <TopologyLayoutModal /> */}
            <DisplaySettingsPanel />
            {/*<GetCamerasButton />*/}
            <ExportGraph />
            <ImportGraph />
        </div>
    );
}
