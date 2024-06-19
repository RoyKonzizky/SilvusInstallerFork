import {Dispatch, SetStateAction} from "react";

export function changePreset(selectedPreset: string, setFrequency: Dispatch<SetStateAction<string>>, setBandwidth: Dispatch<SetStateAction<string>>, setTotalTransitPower: Dispatch<SetStateAction<string>>) {
    switch (selectedPreset) {
        case 'High':
            setFrequency('2490');
            setBandwidth('20');
            setTotalTransitPower('36');
            return;
        case 'Medium':
            setFrequency('2360');
            setBandwidth('5');
            setTotalTransitPower('18');
            return;
        case 'Low':
            setFrequency('2210');
            setBandwidth('1.25');
            setTotalTransitPower('0');
            break;
    }
}