import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {RootState} from "../../../redux/store.ts";
import {ISettingsProps} from "./ISettingsProps.ts";
import {updateTheSettingsState} from "../../../redux/Settings/settlingsSlice.ts";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";
import {bandwidthValues, frequencyValues, totalTransitPowerValues} from "../../../constants/SilvusDropDownValues.ts";
import {fetchBasicSettingsData} from "../../../utils/settingsUtils.ts";
import PresetsButton from "../../PresetsButton/PresetsButton.tsx";
import {changePreset} from "../../../utils/presetsUtils.ts";
// import {getInfoFromTheSilvusDevice} from "../../../scripts/getInfoFromTheSilvusDevice.ts";
// import {SilvusDataType} from "../../../constants/SilvusDataType.ts";

export function Settings(props: ISettingsProps) {
    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency));
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth));
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower));
    const ipAddress = useSelector((state: RootState) => state.ip.ip_address);
    const [selectedPreset, setSelectedPreset] = useState(useSelector((state: RootState) => state.presets.chosenSpectrum));
    const dispatch = useDispatch();

    const settingInputs: Input[][] = [
        [
            {type: "text", label: "Frequency (MHz)", value: frequency, setValue: setFrequency, values: frequencyValues},
            {type: "text", label: "Bandwidth", value: bandwidth, setValue: setBandwidth, values: bandwidthValues}
        ], [
            {type: "text", label: "Network ID", value: networkId, setValue: setNetworkId},
            {type: "text", label: "Total Transit Power", value: totalTransitPower, setValue: setTotalTransitPower, values: totalTransitPowerValues}
        ], [
            {
                type: "button", label: "Save",
                onClick: () => dispatch(updateTheSettingsState({frequency: frequency, bandwidth: bandwidth, networkId: networkId, totalTransitPower: totalTransitPower}))
            },
            {
                type: "button", label: "Save Network",
                onClick: () => dispatch(updateTheSettingsState({frequency: frequency, bandwidth: bandwidth, networkId: networkId, totalTransitPower: totalTransitPower}))
            }
        ]
    ];

    useEffect(() => {
        const loadData = async () => {
            const basicSettingsResponse = await fetchBasicSettingsData();
            // option from the server API/Docker:
            setFrequency(basicSettingsResponse.frequency);
            setBandwidth(basicSettingsResponse.bw);
            setNetworkId(basicSettingsResponse.nw_name);
            setTotalTransitPower(basicSettingsResponse.power_dBm);
            // option from the Silvus:
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Frequency, ipAddress, setFrequency);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Bandwidth, ipAddress, setBandwidth);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.NetworkId, ipAddress, setNetworkId);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.TotalTransitPower, ipAddress, setTotalTransitPower);
        }
        loadData();
    }, [dispatch, ipAddress]);

    useEffect(() => {
        changePreset(selectedPreset, setFrequency, setBandwidth, setTotalTransitPower);
    }, [selectedPreset]);

    return (
        <>
            <div className={`${!props.isSmaller && "h-screen"} flex flex-col justify-center items-center gap-y-8`}>
                <AppInputs appInputs={settingInputs} className={'w-[130%]'}/>
            </div>
            <PresetsButton selectedPreset={selectedPreset} setSelectedPreset={setSelectedPreset}/>
        </>
    );
}