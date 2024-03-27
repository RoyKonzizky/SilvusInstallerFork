import {router} from "../../../main.tsx";

export function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
                {router.routes.map(({ path}, index) => (
                    <div key={index} className="bg-gray-900 p-4">
                        <h2 className="text-xl font-semibold mb-2">{path}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}