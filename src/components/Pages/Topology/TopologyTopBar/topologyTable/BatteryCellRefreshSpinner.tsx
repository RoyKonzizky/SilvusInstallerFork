import refreshIcon from "../../../../../assets/refresh.svg";
import {useState} from "react";
import {updateSingleDeviceBattery} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";
import {t} from "i18next";

interface IBatteryColumnRefreshSpinner {
    deviceId: string,
    dispatch: any,
    elementBattery: string,
}

export function BatteryCellRefreshSpinner(props: IBatteryColumnRefreshSpinner) {
    const [isSpin, setIsSpin] = useState(false);

    const handleRefreshClick = async () => {
        setIsSpin(true);
        setTimeout(() => {
            updateBatteryInfo(props.deviceId, props.dispatch, props.elementBattery);
        },2000);
    };

    const updateBatteryInfo = async (deviceId: string, dispatch: any, elementBattery: string) => {
        let batteryStatus = '-1';
        dispatch(updateSingleDeviceBattery({ id: deviceId, battery: batteryStatus }));

        try {
            const updatedBatteryInfo = await axios.get(`http://localhost:8080/device-battery?device_id=${deviceId}`);

            if (updatedBatteryInfo?.data?.percent ?? false) {
                if (updatedBatteryInfo?.data?.percent === -2) {
                    toast.error(t("batteryInfoFailureMsg"));
                    batteryStatus = '-2';
                } else {
                    batteryStatus = updatedBatteryInfo.data.percent;
                }
            }
        } catch (error) {
            console.error('Error fetching battery info:', error);
            toast.error(t("batteryInfoFailureMsg"));
            batteryStatus = '-2';
        } finally {
            dispatch(updateSingleDeviceBattery({ id: deviceId, battery: batteryStatus }) ?? elementBattery);
            setIsSpin(false);
        }
    };

    return (
        <div>
            <div className={'w-20 flex justify-evenly'}>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button onClick={handleRefreshClick} style={{width: '4rem'}}>
                        <img src={refreshIcon} alt={'refresh icon'}
                             className={`${isSpin ? 'rotate-animation' : ''} w-5 h-5 mr-5`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
