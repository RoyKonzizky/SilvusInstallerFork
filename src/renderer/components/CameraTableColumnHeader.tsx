import { t } from "i18next";
import refreshIcon from "../assets/refresh.svg";
import { loadCameras } from "../utils/topologyUtils/settingsTableUtils.tsx";
import { Dispatch, SetStateAction, useState } from "react";
import { Camera } from "../constants/types/devicesDataTypes.ts";
import { IUserNode } from "@antv/graphin";

interface ICameraTableColumnHeader {
    cameraMap: { [p: string]: Camera };
    setCamerasMap: Dispatch<SetStateAction<{ [p: string]: Camera }>>;
    nodes: IUserNode[];
}

export function CameraTableColumnHeader(props: ICameraTableColumnHeader) {
    const [isSpin, setIsSpin] = useState(false);

    const handleRefreshClick = async () => {
        setIsSpin(true);
        await loadCameras(props.nodes, props.cameraMap, props.setCamerasMap);
        setIsSpin(false);
    };

    return (
        <div className={'w-20 flex justify-evenly'}>
            {t('CameraHeader')}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => props.setCamerasMap({})} style={{ width: '4rem' }}>
                    <img onClick={handleRefreshClick} src={refreshIcon} alt={'refresh icon'}
                        className={`${isSpin ? 'rotate-animation' : ''} w-5 h-5 mr-5`}
                    />
                </button>
            </div>
        </div>
    );
}
