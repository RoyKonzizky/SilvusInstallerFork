import refreshIcon from "../../../../../assets/refresh.svg";
import {Dispatch, SetStateAction, useState} from "react";
import {updateSingleDeviceBattery} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";
import {t} from "i18next";

interface IBatteryRefreshSpinner {
    deviceId: string,
    dispatch: any,
    setElementBattery: Dispatch<SetStateAction<string>>,
    elementBattery: string,
}

export function PopoverBatteryRefreshSpinner(props: IBatteryRefreshSpinner) {
    const [isSpin, setIsSpin] = useState(false);

    const handleRefreshClick = async () => {
        setIsSpin(true);
        setTimeout(() => {
            updateBatteryInfo(props.deviceId, props.dispatch, props.setElementBattery, props.elementBattery);
        },2000);
    };

    const updateBatteryInfo = async (deviceId: string, dispatch: any, setElementBattery: Dispatch<SetStateAction<string>>,
                                    elementBattery: string) => {
        let batteryStatus = '-1'; // Default to loading status
        dispatch(updateSingleDeviceBattery({ id: deviceId, battery: batteryStatus }));
        setElementBattery(batteryStatus); // Set element battery to loading status

        try {
            const updatedBatteryInfo = await axios.get(`http://localhost:8080/device-battery?device_id=${deviceId}`);

            if (updatedBatteryInfo?.data?.percent ?? false) {
                if (updatedBatteryInfo?.data?.percent === -2) {
                    toast.error(t("batteryInfoFailureMsg"));
                    batteryStatus = '-2'; // Set to failure state
                } else {
                    batteryStatus = updatedBatteryInfo.data.percent; // Set actual battery status
                }
            }
        } catch (error) {
            console.error('Error fetching battery info:', error);
            toast.error(t("batteryInfoFailureMsg"));
            batteryStatus = '-2'; // Set to error state
        } finally {
            // Always update the battery status in Redux and the element, regardless of success or failure
            dispatch(updateSingleDeviceBattery({ id: deviceId, battery: batteryStatus }) ?? elementBattery);
            setElementBattery(batteryStatus ?? elementBattery);
            setIsSpin(false);
        }
    };


    return (
        <div className={'w-20 flex justify-evenly'}>
            <div style={{display: 'flex', gap: '1rem'}}>
                <button onClick={() => props.setElementBattery('-1')} style={{width: '4rem'}}>
                    <img onClick={handleRefreshClick} src={refreshIcon} alt={'refresh icon'}
                         className={`${isSpin ? 'rotate-animation' : ''} w-5 h-5 mr-5`}
                    />
                </button>
            </div>
        </div>
    );
}
