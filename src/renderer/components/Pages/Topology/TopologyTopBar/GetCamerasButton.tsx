import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";
import {camsType} from "../../../../constants/types/devicesDataTypes.ts";
import camsRefresh from "../../../../assets/camerasRefresh.png";
import {updateNodes} from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {connectCamToDevice, getCameras} from "../../../../utils/topologyUtils/getCamerasButtonUtils.ts";
export function GetCamerasButton() {
    const dispatch = useDispatch();
    const nodesSelector = useSelector((state: RootState) => state.topologyGroups.nodes);
    const [cameras, setCameras] = useState<camsType | null>(null);

    const loadCamerasData = async () => {
        try {
            const camerasData = await getCameras();
            setCameras(camerasData);
            const newNodes = nodesSelector;
            for (let i = 0; i < nodesSelector.length; i++) {
                newNodes[i].data.camLinks = connectCamToDevice(nodesSelector[i].data.ip, cameras!);
            }
            dispatch(updateNodes(newNodes));
        } catch (error) {
            console.error("Error in receiving cameras", error);
        }
    };

    return(
        <button onClick={loadCamerasData}>
            <img className={'w-10 h-10 rounded-full ml-7'} src={camsRefresh} alt={'refresh cameras'}/>
        </button>
    );
}