import {batteryColor} from "../../../../../utils/topologyUtils/batteryUtils.ts";

interface IBattery{
    voltage: number,
}

export function Battery(props: IBattery) {

    return (
        <div className={'container mx-auto'}>
            <div className={'relative w-72 h-16 border-2 border-blue-500 rounded-lg overflow-hidden'}>
                <div className={`absolute top-0 left-0 w-full h-full ${batteryColor(props.voltage)}`} style={{ width: `${props.voltage}%` }}></div>
                <div className={'absolute top-0 left-0 w-full h-full flex items-center justify-center text-black font-bold text-lg'}>
                    {props.voltage}
                </div>
            </div>
        </div>
    );
}
