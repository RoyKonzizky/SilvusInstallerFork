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
import { useTranslation } from 'react-i18next';
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
    const { t, } = useTranslation();

    const settingInputs: Input[][] = [
        [
            {type: "text", label: t('frequency'), value: frequency, setValue: setFrequency, values: frequencyValues},
            {type: "text", label: t('bandwidth'), value: bandwidth, setValue: setBandwidth, values: bandwidthValues}
        ], [
            {type: "text", label: t('networkId'), value: networkId, setValue: setNetworkId},
            {type: "text", label: t('totalTransitPower'), value: totalTransitPower, setValue: setTotalTransitPower, values: totalTransitPowerValues}
        ], [
            {
                type: "button", label: t("save"),
                onClick: () => dispatch(updateTheSettingsState({frequency: frequency, bandwidth: bandwidth, networkId: networkId, totalTransitPower: totalTransitPower}))
            },
            {
                type: "button", label: t("saveNetwork"),
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
            setNetworkId(basicSettingsResponse.net_id);
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
                <AppInputs appInputs={settingInputs} className={props.isSmaller ? 'flex-col' : 'w-[130%]'} isSmaller={props.isSmaller} />
            </div>
            <PresetsButton selectedPreset={selectedPreset} setSelectedPreset={setSelectedPreset}/>
        </>
    );
}