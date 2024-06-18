import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Input} from "../../AppInputs/InputTypes/Input.ts";
import {RootState} from "../../../redux/store.ts";
import {ISettingsProps} from "./ISettingsProps.ts";
import {getInfoFromTheSilvusDevice} from "../../../scripts/getInfoFromTheSilvusDevice.ts";
import {SilvusDataType} from "../../../constants/SilvusDataType.ts";
import {updateTheSettingsState} from "../../../redux/Settings/settlingsSlice.ts";
import {fetchBasicSettingsData} from "../../../utils/settingsUtils.ts";
import {AppInputs} from "../../AppInputs/AppInputs.tsx";

export function Settings(props: ISettingsProps) {
    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency).toString());
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth).toString());
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower).toString());
    const [ipAddress, setIpAddress] = useState(""); // "172.20.241.202"
    const dispatch = useDispatch();

    const settingInputs: Input[][] = [
        [
            {type: "text", label: "Frequency (MHz)", value: frequency, setValue: setFrequency, values: ['2210', '2220', '2240', '2260', '2280', '2300', '2320', '2340', '2360', '2380', '2385', '2390', '2420', '2440', '2452', '2480.0', '2480', '2490']},
            {type: "text", label: "Bandwidth", value: bandwidth, setValue: setBandwidth, values: ['1.25', '2.5', '5', '10', '20']}
        ], [
            {type: "text", label: "Network ID", value: networkId, setValue: setNetworkId},
            {type: "text", label: "Total Transit Power", value: totalTransitPower, setValue: setTotalTransitPower, values: ['Enable Max Power', '0', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36']}
        ], [
            {
                type: "button", label: "Save",
                onClick: () => dispatch(updateTheSettingsState({
                    frequency: frequency, bandwidth: bandwidth,
                    networkId: networkId, totalTransitPower: totalTransitPower
                }))
            },
            {
                type: "button", label: "Save Network",
                onClick: () => dispatch(updateTheSettingsState({
                    frequency: frequency, bandwidth: bandwidth,
                    networkId: networkId, totalTransitPower: totalTransitPower
                }))
            }
        ]
    ];

    useEffect(() => {
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
            <AppInputs appInputs={settingInputs} className={'w-[130%]'}/>
        </div>
    );
}