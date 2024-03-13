import '../App.css';
import { useState } from 'react';

function Sandwich() {
    const [isCollapsed, setCollapsed] = useState<boolean>(true);

    const toggleCollapse = () => {
        setCollapsed(!isCollapsed);
    };

    const handleMouseEnter = () => {
        setCollapsed(false);
    };

    const handleMouseLeave = () => {
        setCollapsed(true);
    };

    return (
        <div className="bg-gray-500 text-black">
            <div className="flex flex-col items-end">
                <div className="mb-2">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={toggleCollapse}
                    >
                        {isCollapsed ? 'Expand' : 'Collapse'}
                    </button>
                </div>

                <div
                    className={`overflow-x-hidden transition-max-width duration-500 max-w-${isCollapsed ? '0' : 'screen-sm'}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Your collapsible content goes here */}
                    <p className="p-4 bg-gray-200 mb-2 mt-2">{!isCollapsed ? "Collapsible content..." : "FILE"}</p>
                    <p className="p-4 bg-gray-200 mb-2 mt-2">{!isCollapsed ? "Collapsible content..." : "FILE"}</p>
                    <p className="p-4 bg-gray-200 mb-2 mt-2">{!isCollapsed ? "Collapsible content..." : "FILE"}</p>
                </div>

            </div>
        </div>
    );
}

export default Sandwich;