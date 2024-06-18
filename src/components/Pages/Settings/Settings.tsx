import AppInput from "../../AppInput/AppInput.tsx";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Input, isInputWithOnClick, isInputWithValue} from "../../AppInput/InputTypes/Input.ts";
import {RootState} from "../../../redux/store.ts";
import {ISettingsProps} from "./ISettingsProps.ts";
import {getInfoFromTheSilvusDevice} from "../../../scripts/getInfoFromTheSilvusDevice.ts";
import {SilvusDataType} from "../../../constants/SilvusDataType.ts";
import {updateTheSettingsState} from "../../../redux/Settings/settlingsSlice.ts";
import {fetchBasicSettingsData} from "../../../utils/settingsUtils.ts";

export function Settings(props: ISettingsProps) {
    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency).toString());
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth).toString());
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower).toString());
    const [ipAddress, setIpAddress] = useState(""); // "172.20.241.202"
    const dispatch = useDispatch();

    const settingInputs: Input[][] = [
        [
            {type: "number", label: "Frequency (MHz)", value: frequency, setValue: setFrequency},
            {type: "number", label: "Bandwidth", value: bandwidth, setValue: setBandwidth}
        ], [
            {type: "text", label: "Network ID", value: networkId, setValue: setNetworkId},
            {type: "number", label: "Total Transit Power", value: totalTransitPower, setValue: setTotalTransitPower}
        ], [
            {
                type: "button", label: "Save",
                onClick: () => dispatch(updateTheSettingsState({
                    frequency: frequency === "" ? 0 : parseInt(frequency), bandwidth: bandwidth === "" ? 0 : parseInt(bandwidth),
                    networkId: networkId, totalTransitPower: totalTransitPower === "" ? 0 : totalTransitPower
                }))
            },
            {
                type: "button", label: "Save Network",
                onClick: () => dispatch(updateTheSettingsState({
                    frequency: frequency === "" ? 0 : parseInt(frequency), bandwidth: bandwidth === "" ? 0 : parseInt(bandwidth),
                    networkId: networkId, totalTransitPower: totalTransitPower === "" ? 0 : totalTransitPower
                }))
            }
        ]
    ];

    useEffect( () => {
        const loadData = async () => {
            const basicSettingsResponse = await fetchBasicSettingsData();
            console.log(basicSettingsResponse);
            setIpAddress(basicSettingsResponse.radio_ip); // basicSettingsResponse.radio_ip ?? "172.20.241.202"
            // option from the server API/Docker:
            setFrequency(basicSettingsResponse.frequency);
            setBandwidth(basicSettingsResponse.bw);
            setNetworkId(basicSettingsResponse.nw_name);
            setTotalTransitPower(basicSettingsResponse.power_dBm);
            // option from the Silvus:
            getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Frequency, ipAddress, setFrequency);
            getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Bandwidth, ipAddress, setBandwidth);
            getInfoFromTheSilvusDevice(dispatch, SilvusDataType.NetworkId, ipAddress, setNetworkId);
            getInfoFromTheSilvusDevice(dispatch, SilvusDataType.TotalTransitPower, ipAddress, setTotalTransitPower);
        }
        loadData();
    }, [dispatch, ipAddress]);

    return (
        <div className={`${!props.isSmaller && "h-screen"} flex flex-col justify-center items-center gap-y-8`}>
            {settingInputs.map((inputs, index) => (
                <div key={index} className="flex justify-center gap-x-8 w-[52%]">
                    {inputs.map((input, idx) => (
                        <AppInput
                            key={idx} type={input.type} label={input.label}
                            value={isInputWithValue(input) ? input.value : undefined}
                            setValue={isInputWithValue(input) ? input.setValue : undefined}
                            onClick={isInputWithOnClick(input) ? input.onClick : undefined}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}