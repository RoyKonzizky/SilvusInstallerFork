import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Input } from "../../AppInputs/InputTypes/Input.ts";
import { RootState } from "../../../redux/store.ts";
import { ISettingsProps } from "./ISettingsProps.ts";
import { updateTheSettingsState } from "../../../redux/Settings/settlingsSlice.ts";
import { AppInputs } from "../../AppInputs/AppInputs.tsx";
import { bandwidthValues, frequencyValues, totalTransitPowerValues } from "../../../constants/SilvusDropDownValues.ts";
import { fetchBasicSettingsData, setBasicSettingsData } from "../../../utils/settingsUtils.ts";
import PresetsImage from "../../../assets/presets.svg";
import { useTranslation } from 'react-i18next';
import BottomCircle from "../../PresetsButton/BottomCircle/BottomCircle.tsx";
import axios from "axios";
import { toast } from "react-toastify";

export function Settings(props: ISettingsProps) {
    const isMounted = useRef(false);

    const [frequency, setFrequency] = useState(useSelector((state: RootState) => state.settings.frequency));
    const [bandwidth, setBandwidth] = useState(useSelector((state: RootState) => state.settings.bandwidth));
    const [networkId, setNetworkId] = useState(useSelector((state: RootState) => state.settings.networkId));
    const [totalTransitPower, setTotalTransitPower] = useState(useSelector((state: RootState) => state.settings.totalTransitPower));
    const ipAddress = useSelector((state: RootState) => state.ip.ip_address);

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const saveSettings = async (isNetworkSave: boolean) => {
        if (isNetworkSave) {
            const confirmed = confirm(t("networkSaveConfirmation"));
            if (!confirmed) {
                return;
            }
        }

        try {
            const response = await setBasicSettingsData(
                isNetworkSave,
                parseFloat(frequency),
                bandwidth + " MHz",
                networkId,
                totalTransitPower
            );

            if (isMounted.current && response[0] === "Success") {
                dispatch(updateTheSettingsState({
                    frequency: frequency,
                    bandwidth: bandwidth,
                    networkId: networkId,
                    totalTransitPower: totalTransitPower
                }));
                toast.success(t("saveSettingsSuccessMsg"));
            } else {
                toast.error(t("saveSettingsFailureMsg"));
            }
        } catch (e) {
            toast.error(t("saveSettingsFailureMsg"));
        }
    }

    const settingInputs: Input[][] = [
        [
            { type: "text", label: t('frequency'), value: frequency, setValue: setFrequency, values: frequencyValues },
            { type: "text", label: t('bandwidth'), value: bandwidth, setValue: setBandwidth, values: bandwidthValues }
        ], [
            { type: "text", label: t('networkId'), value: networkId, setValue: setNetworkId },
            { type: "text", label: t('totalTransitPower'), value: totalTransitPower, setValue: setTotalTransitPower, values: totalTransitPowerValues }
        ], [
            { type: "button", label: t("save"), onClick: () => saveSettings(false) },
            { type: "button", label: t("saveNetwork"), onClick: () => saveSettings(true) }
        ]
    ];

    useEffect(() => {
        const loadData = async () => {
            const basicSettingsResponse = await fetchBasicSettingsData();
            // option from the server API/Docker:
            setFrequency(basicSettingsResponse.frequency as string);
            setBandwidth(basicSettingsResponse.bw as string);
            setNetworkId(basicSettingsResponse.net_id);
            setTotalTransitPower(basicSettingsResponse.power_dBm == 'enable_max' ? 'Enable Max Power' : basicSettingsResponse.power_dBm);
            // option from the Silvus:
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Frequency, ipAddress, setFrequency);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.Bandwidth, ipAddress, setBandwidth);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.NetworkId, ipAddress, setNetworkId);
            // getInfoFromTheSilvusDevice(dispatch, SilvusDataType.TotalTransitPower, ipAddress, setTotalTransitPower);
        }
        loadData();
    }, [dispatch, ipAddress]);

    const openSilvusWebSystem = async () => {
        try {
            await axios.get('http://localhost:8080/silvus-tech-gui');
        } catch (error) {
            console.error('Error while opening Silvus Tech GUI in browser:', error);
        }
    }

    return (
        <>
            <div className={`${!props.isSmaller && "h-screen"} flex flex-col justify-center items-center gap-y-8`}>
                <AppInputs appInputs={settingInputs} className={props.isSmaller ? 'flex-col' : `mr-[10%] ${i18n.language === 'en' ? 'w-[90%]' : 'w-[100%]'}`} isSmaller={props.isSmaller} />
            </div>
            <div
                onClick={openSilvusWebSystem}
                className="flex items-start justify-start absolute bottom-6 left-6 cursor-pointer"
            >
                <BottomCircle
                    image={PresetsImage}
                    bgColor='#303030'
                    radius={40}
                />
            </div>
        </>
    );
}