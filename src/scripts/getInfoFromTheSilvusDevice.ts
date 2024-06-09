import axios from "axios";
import {Dispatch, SetStateAction} from "react";
import {UnknownAction} from "@reduxjs/toolkit";
import {setBandwidth, setFrequency, setNetworkId, setTotalTransitPower} from "../redux/Settings/settlingsSlice.ts";
import {SilvusDataType} from "../constants/SilvusDataType.ts";

export function getInfoFromTheSilvusDevice(dispatch: Dispatch<UnknownAction>, methodName: string, ipAddress: string, setStateActionForSetting: Dispatch<SetStateAction<string>>) {
    axios.post(`http://${ipAddress}/streamscape_api`, `{"jsonrpc":"2.0","method":"${methodName}","id":"sbkb5u0c"}`).then(response => {
        setStateActionForSetting(response.data.result[0]);
        switch(methodName) {
            case SilvusDataType.NetworkId:
                dispatch(setNetworkId(response.data.result[0]));
                break;
            case SilvusDataType.Frequency:
                dispatch(setFrequency(response.data.result[0] as number));
                break;
            case SilvusDataType.Bandwidth:
                dispatch(setBandwidth(response.data.result[0] as number));
                break;
            case SilvusDataType.TotalTransitPower:
                dispatch(setTotalTransitPower(response.data.result[0] as number));
                break;
        }
    }).catch(error => {
        console.error('Error sending message:', error);
    });
}