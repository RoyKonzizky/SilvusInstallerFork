import { TableModal } from "./topologyTable/TableModal.tsx";
import Graphin, { IUserEdge, IUserNode } from "@antv/graphin";
import { Combo } from "@antv/graphin/es/typings/type";
import { useState, useRef } from "react";
import { Popover } from "antd";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[], combos: Combo[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] =
        useState<IUserNode | IUserEdge | null>();
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const graphRef = useRef<any>(null);

    const handleElementClick = (event: { item: any; }) => {
        const clickedElement = event.item;
        const model = clickedElement.getModel();
        setSelectedElement(model);

        const graph = graphRef.current?.graph;
        if (graph) {
            const point = graph.getCanvasByPoint(model.x, model.y);
            setPopoverPosition({ x: point.x, y: point.y });
        }
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
        <Graphin ref={graphRef} style={{ background: "black", width: '100%', height: '100%', color: "white" }}
                 modes={modes} data={props.graphData}>
            <TableModal graphData={props.graphData} />
            {selectedElement && (
                <Popover title="Element Details" placement={"top"} arrow={false}
                         open={!!selectedElement}
                         getPopupContainer={trigger => trigger.parentElement!}
                         overlayStyle={{
                             zIndex: 1000,
                             top: popoverPosition.y,
                             left: popoverPosition.x,
                             height: '75px',
                             position: 'absolute',
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
