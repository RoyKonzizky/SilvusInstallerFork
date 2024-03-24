import SettingInput from "./SettingInput/SettingInput.tsx";
import {useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import * as SettingsSlice from "../../../redux/Settings/settlingsSlice.ts";
import {Input, isInputWithOnClick, isInputWithValue} from "./InputTypes/Input.ts";
import {RootState} from "../../../redux/store.ts";
import BottomCircle from "./BottomCircle/BottomCircle.tsx";

export function Settings() {
    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency).toString());
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth).toString());
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower).toString());
    const states = ['High', 'Medium', 'Low'];
    const [presets, setPresets] = useState(states[0]);
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
                onClick: () => dispatch(SettingsSlice.updateTheSettingsState({
                    frequency: frequency === "" ? 0 : parseInt(frequency), bandwidth: bandwidth === "" ? 0 : parseInt(bandwidth),
                    networkId: networkId, totalTransitPower: totalTransitPower === "" ? 0 : totalTransitPower
                }))
            },
            {
                type: "button", label: "Save Network",
                onClick: () => dispatch(SettingsSlice.updateTheSettingsState({
                    frequency: frequency === "" ? 0 : parseInt(frequency), bandwidth: bandwidth === "" ? 0 : parseInt(bandwidth),
                    networkId: networkId, totalTransitPower: totalTransitPower === "" ? 0 : totalTransitPower
                }))
            }
        ]
    ];

    return (
        <div className="text-3xl h-screen flex flex-col justify-center items-center gap-y-8">
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
            <div className="absolute bottom-2 left-0 cursor-pointer"
                 onClick={() => setPresets(states[(states.indexOf(presets) + 1) % states.length])}>
                <BottomCircle radius={30} text={presets.charAt(0)}
                              bgColor={presets === 'High' ? 'red' : presets === 'Medium' ? 'yellow' : presets === 'Low' ? 'green' : ''}/>
            </div>
        </div>
    );
}