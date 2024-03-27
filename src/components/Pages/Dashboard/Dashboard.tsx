import {Settings} from "../Settings/Settings.tsx";
import {Topology} from "../Topology/Topology.tsx";

export function Dashboard() {
    const elements = [<Settings className="text-xs"/>, <Topology/>, <>PHOTO</>, <>VIDEO</>, <>GALLERY</>];
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-2 gap-4">
                {elements.map((element, index) => (
                    <div key={index} className="bg-gray-900 text-xs">
                        <div>
                            {element}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}