import {TableModal} from "./topologyTable/TableModal.tsx";
import Graphin, {IUserEdge, IUserNode} from "@antv/graphin";
import {Combo} from "@antv/graphin/es/typings/type";
import {useState} from "react";
import {Popover} from "antd";

interface ITopologyGraph {
    graphData: { nodes: IUserNode[], edges: IUserEdge[], combos: Combo[] },
}

export function TopologyGraph(props: ITopologyGraph) {
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>();
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({x: 0, y: 0});

    const handleElementClick = (event: { item: any; }) => {
        const clickedElement = event.item;
        setSelectedElement(clickedElement.getModel());
        setPopoverPosition({x: clickedElement.getModel().x, y: clickedElement.getModel().y});
    };

    const handleCloseButtonClick = () => {
        setSelectedElement(null);
    };

    const handleGraphinDrag = (event: { x: number; y: number }) => {
        if (selectedElement) {
            // Update popover position when Graphin canvas is dragged
            setPopoverPosition({x: selectedElement.x + event.x, y: selectedElement.y + event.y});
        }
        console.log("hi")
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
            {
                type: "drag-canvas",
                onDrag: handleGraphinDrag,
            }
        ]
    };

    const defaultNode = {
        defaultNode: {
            style: {
                label: {
                    fill: "#ffffff",
                },
            },
        }
    };

    return (
        <div className={'relative w-full h-full bg-black text-white'}>
            <Graphin
                style={{background: "black"}}
                modes={modes}
                defaultNode={defaultNode}
                data={props.graphData}
                // onDrag={handleGraphinDrag}
            >
                <TableModal graphData={props.graphData}/>
                {selectedElement && (
                    <Popover
                        title="Element Details"
                        placement={"top"}
                        arrow={false}
                        open={!!selectedElement}
                        overlayStyle={{
                            zIndex: 1000,
                            top: popoverPosition.y,
                            left: popoverPosition.x,
                            height: '75px',
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
        </div>
    );
}
