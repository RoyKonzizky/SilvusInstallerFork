import { Settings } from "../Settings/Settings.tsx";
import { Topology } from "../Topology/Topology.tsx";

export function Dashboard() {
    const elements = [<Settings isSmaller={true} />, <Topology isSmaller={true} />];

    return (
        <div className="h-screen w-screen font-[Ebrima] text-right bg-black overflow-auto max-h-screen appData">
            <div className="h-[90vh] w-screen grid grid-cols-[repeat(auto-fit,_minmax(500px,_1fr))] container">
                {elements.map((element, index) => (
                    <div key={index} className="flex justify-center items-center border-[2px] border-[#213547] childComponent">
                        {element}
                    </div>
                ))}
            </div>
        </div>
    );
}
