import {ChangeEvent, useState} from "react";

function Microphone() {
    const [volume, setVolume] = useState(50);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        setVolume(newVolume);
    };

    return (
        <div className="text-3xl h-screen flex flex-col justify-center items-center gap-y-8">
            <div className="flex gap-x-8 bg-[#303030]/70 p-3 rounded-xl">
                <label>Volume</label>
                <input
                    type="range"
                    id="volume"
                    name="volume"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default Microphone;