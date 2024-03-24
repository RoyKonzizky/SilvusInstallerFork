import SettingInput from "./SettingInput/SettingInput.tsx";
import {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as SettingsSlice from "../../../redux/Settings/settlingsSlice.ts";
import {Input, isInputWithOnClick, isInputWithValue} from "./InputTypes/Input.ts";
import {RootState} from "../../../redux/store.ts";

export function Settings() {
    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency));
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth));
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower));
    const dispatch = useDispatch();

    const settingInputs: Input[][] = [
        [
            {type: "text", label: "Frequency (MHz)", value: frequency, setValue: setFrequency},
            {type: "text", label: "Bandwidth", value: bandwidth, setValue: setBandwidth},
        ], [
            {type: "text", label: "Network ID", value: networkId, setValue: setNetworkId},
            {type: "text", label: "Total Transit Power", value: totalTransitPower, setValue: setTotalTransitPower}
        ], [
            {
                type: "button", label: "Save",
                onClick: () => {
                    dispatch(SettingsSlice.updateTheSettingsState({
                        frequency: frequency, bandwidth: bandwidth,
                        networkId: networkId, totalTransitPower: totalTransitPower
                    }));
                }
            },
            {
                type: "button",
                label: "Save Network",
                onClick: () => {
                    dispatch(SettingsSlice.updateTheSettingsState({
                        frequency: frequency, bandwidth: bandwidth,
                        networkId: networkId, totalTransitPower: totalTransitPower
                    }));
                }
            },
        ]
    ];

    return (
        <div className="text-3xl h-screen flex justify-center items-center">
            <div className="flex flex-col gap-y-8">
                {settingInputs.map((inputs, index) => (
                    <div key={index} className="flex gap-x-8">
                        {inputs.map((input, idx) => (
                            <SettingInput
                                key={idx} type={input.type} label={input.label}
                                value={isInputWithValue(input) ? input.value : undefined}
                                setValue={isInputWithValue(input) ? input.setValue : undefined}
                                onClick={isInputWithOnClick(input) ? input.onClick : undefined}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}