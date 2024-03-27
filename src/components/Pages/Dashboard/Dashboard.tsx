import {Settings} from "../Settings/Settings.tsx";
import {Topology} from "../Topology/Topology.tsx";
import {Camera} from "../Camera/Camera.tsx";

export function Dashboard() {
    const elements = [<Settings isSmaller={true}/>, <Topology isSmaller={true}/>, <Camera/>, <>VIDEO</>, <>GALLERY</>];
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-2 gap-4">
                {elements.map((element, index) => (
                    <div key={index} className="bg-gray-900 text-xs p-3 rounded-xl">
                        {element}
                    </div>
                ))}
            </div>
        </div>
    );
}