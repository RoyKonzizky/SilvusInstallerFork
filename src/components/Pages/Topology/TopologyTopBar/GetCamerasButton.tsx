import {useDispatch} from "react-redux";
import {camsType} from "../../../../constants/types/devicesDataTypes.ts";
import camsRefresh from "../../../../assets/camerasRefresh.png";
import {setCameras} from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import {getCameras} from "../../../../utils/topologyUtils/getCamerasButtonUtils.ts";

export function GetCamerasButton() {
    const dispatch = useDispatch();

    const loadCamerasData = async () => {
        try {
            const cameras: camsType = await getCameras();
            // console.log(cameras);
            dispatch(setCameras(cameras));
        } catch (error) {
            console.error("Error in receiving cameras", error);
        }
    };

    return(
        <button onClick={loadCamerasData}>
            <img className={'w-14 h-14 mt-5 rounded-full'} src={camsRefresh} alt={'refresh cameras'}/>
        </button>
    );
}
