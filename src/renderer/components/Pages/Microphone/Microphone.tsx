import {useState} from "react";
import { useTranslation } from 'react-i18next';
function Microphone() {
    const [volume, setVolume] = useState(50);
    const { t, } = useTranslation();

    return (
        <div className="text-3xl h-screen flex flex-col justify-center items-center gap-y-8">
            <div className="flex gap-x-8 bg-[#303030]/70 p-3 rounded-xl">
                <label>{t('volume')}</label>
                <input type="range" min={0} max={100} value={volume} onChange={(event) => setVolume(parseInt(event.target.value))}/>
            </div>
        </div>
    );
}

export default Microphone;