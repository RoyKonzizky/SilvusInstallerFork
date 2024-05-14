import {TableModal} from "./topologyTable/TableModal.tsx";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import {Combo} from "@antv/graphin/es/typings/type";
import {useState} from "react";
import {Popover} from "antd";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[], combos: Combo[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] =
        useState<IUserNode | IUserEdge | null>();

    const handleElementClick = (event: { item: any; }) => {
        const clickedElement = event.item;
        setSelectedElement(clickedElement.getModel());
    };

    const handleCloseButtonClick = () => {
        setSelectedElement(null);
    };

    const modes = {
        default: ['drag-node', 'drag-canvas', 'zoom-canvas', 'drag-combo',
            {
                type: 'click-select',
                onClick: handleElementClick,
            },
            {
                type: 'click-select',
                selectNode: true,
                selectEdge: true,
            },
        ]
    };

    return (
        <Graphin style={{background: "black", position: "relative", width: '100%', height: '100%', color: "white"}}
                 modes={modes} data={props.graphData}>
            <TableModal graphData={props.graphData}/>
            {selectedElement && (
                <Popover title="Element Details" placement={"top"} arrow={false} open={!!selectedElement}
                         overlayStyle={{
                             zIndex: 1000, top: selectedElement.y, left: selectedElement.x, height: '75px',
                             position: 'absolute'
                         }}
                         content={
                             <div>
                                 <p>{`This is the content of the popover for ${selectedElement.id}`}</p>
                                 <button
                                     className={"bg-gray-900 w-9 h-9 focus:opacity-75 text-white font-bold py-2 px-4 " +
                                         "rounded focus:outline-none z-50 flex justify-center"}
                                     onClick={handleCloseButtonClick}>X
                                 </button>
                             </div>
                         }
                />
            )}
        </Graphin>
    );
}
