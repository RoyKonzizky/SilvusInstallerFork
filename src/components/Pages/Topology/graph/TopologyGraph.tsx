import {useEffect, useRef, useState} from "react";
import { useDispatch } from "react-redux";
import Graphin, { IUserEdge, IUserNode } from "@antv/graphin";
import { ElementPopover } from "./popover/ElementPopover.tsx";
import { graphStyle } from "../../../../utils/topologyUtils/graphUtils.ts";
import { TopologyTopBar } from "../TopologyTopBar/TopologyTopBar.tsx";
import { updateNodePositions } from "../../../../redux/TopologyGroups/topologyGroupsSlice.ts";

interface ITopologyGraph {
    nodes: IUserNode[],
    edges: IUserEdge[],
    setDraggingState: (isDragged: boolean) => void,
}

export function TopologyGraph(props: ITopologyGraph) {
    const dispatch = useDispatch();
    const [selectedElement, setSelectedElement] = useState<IUserNode | IUserEdge | null>(null);
    const [popoverPosition, setPopoverPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const graphRef = useRef<any>(null);
    const [doubleClickDetector, setDoubleClickDetector] = useState(0);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const [isTouchStarted, setIsTouchStarted] = useState(false);
    const { setDraggingState } = props;
    const backgroundRef = useRef<HTMLDivElement | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null); // Store uploaded image URL

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (!graph) return;

        graph.fitView();

        const updateBackground = () => {
            if (!backgroundRef.current) return;

            const matrix = graph.get("group").getMatrix();
            const scale = matrix[0];
            const translateX = matrix[6];
            const translateY = matrix[7];

            backgroundRef.current.style.transform = `
                translate(${translateX}px, ${translateY}px) 
                scale(${scale})
            `;
            backgroundRef.current.style.transformOrigin = "top left";
        };

        graph.on("viewportchange", updateBackground);

        return () => {
            graph.off("viewportchange", updateBackground);
        };
    }, []);

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (!graph) return;

        graph.fitView();
    }, []);

    useEffect(() => {
        const graph = graphRef.current?.graph;
        if (!graph) return;

        const handleNodeDragStart = () => {
            setDraggingState(true);
            setIsTouchStarted(true);
            setSelectedElement(null);
        };

        const handleNodeDragEnd = () => {
            if (!isTouchStarted) return;
            // const updatedNodes = graph.getNodes().map((node: IUserNode) => {
            //     const nodeModel = node.getModel();
            //     return {
            //         id: nodeModel.id,
            //         x: nodeModel.x,
            //         y: nodeModel.y,
            //     };
            // });
            //
            // dispatch(updateNodePositions(updatedNodes));
            setDraggingState(false);
            setIsTouchStarted(false);
        };

        const handleNodeTouchStart = (event: any) => {
            const model = event.item.getModel();
            console.log('Touch started on node ID:', model.id);
            setDraggingState(true);
            setIsTouchStarted(true);
            setSelectedElement(null);
        };

        const handleNodeTouchEnd = () => {
            if (!isTouchStarted) return;
            // const updatedNodes = graph.getNodes().map((node: IUserNode) => {
            //     const nodeModel = node.getModel();
            //     return {
            //         id: nodeModel.id,
            //         x: nodeModel.x,
            //         y: nodeModel.y,
            //     };
            // });
            // dispatch(updateNodePositions(updatedNodes));
            setDraggingState(false);
            setIsTouchStarted(false);
        };

        const handleCanvasTouchStart = () => {
            setDraggingState(true);
            setIsTouchStarted(true);
            setSelectedElement(null);
        };

        const handleCanvasTouchEnd = () => {
            if (!isTouchStarted) return;
            setDraggingState(false);
            setIsTouchStarted(false);
        };

        graph.on('canvas:touchstart', handleCanvasTouchStart);
        graph.on('canvas:touchend', handleCanvasTouchEnd);

        graph.on('node:dragstart', handleNodeDragStart);
        graph.on('node:dragend', handleNodeDragEnd);

        graph.on('node:touchstart', handleNodeTouchStart);
        const canvasElement = graph.get('canvas').get('el');
        canvasElement.addEventListener('touchend', handleNodeTouchEnd);

        return () => {
            graph.off('canvas:touchstart', handleNodeTouchStart);
            graph.off('canvas:touchend', handleNodeTouchStart);

            graph.off('node:dragstart', handleNodeDragStart);
            graph.off('node:dragend', handleNodeDragEnd);

            graph.off('node:touchstart', handleNodeTouchStart);
            canvasElement.removeEventListener('touchend', handleNodeTouchEnd);

            // Save node positions when the component is unmounting
            dispatchNodesLocations(graph);
        };
    }, [props.nodes, isTouchStarted]);

    function dispatchNodesLocations(graph: any) {
        if (graph && graph.getNodes()) {
            const updatedNodes = graph.getNodes().map((node: IUserNode) => {
                const nodeModel = node.getModel();
                return {
                    id: nodeModel.id,
                    x: nodeModel.x,
                    y: nodeModel.y,
                };
            });
            dispatch(updateNodePositions(updatedNodes));
        }
    }

    const handleElementClick = (event: { item: any; }) => {
        const model = event.item.getModel();
        //Only nodes can be selected now.
        if (model.type === 'graphin-circle'){
            setSelectedElement(model);

            const graph = graphRef.current?.graph;
            if (graph) {
                const point = graph.getCanvasByPoint(model.x, model.y);
                setPopoverPosition({ x: point.x, y: point.y });
            }
        }
    };

    useEffect(() => {
        const graph = graphRef.current?.graph;

        if (graph) {
            graph.on('node:click', handleElementClick);

            graph.on('node:touchstart', (event: any) => {
                if (timerId) {
                    clearTimeout(timerId);
                }

                setDoubleClickDetector(prevState => prevState + 1);

                if (doubleClickDetector === 1){
                    setDoubleClickDetector(0);
                    handleElementClick(event);
                }else {
                    const newTimerId = setTimeout(() => {
                        setDoubleClickDetector(0);
                    }, 200);
                    setTimerId(newTimerId);
                }
            });
        }

        return () => {
            if (graph) {
                graph.off('node:click', handleElementClick);
                graph.off('node:touchstart');
            }

            // Save node positions when the component is unmounting
            dispatchNodesLocations(graph);
        };
    }, [doubleClickDetector, props.nodes, isTouchStarted]);

    const modes = {
        default: [
            'drag-node', 'drag-combo', 'drag-canvas', 'zoom-canvas',
            { type: 'click-select', onClick: handleElementClick, selectNode: true, },
            { type: 'click-select' },
        ]
    };

    return (
        <div style={{width: "100%", height: "100%", overflow: "hidden",}}>
            <div ref={backgroundRef}
                style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
                    backgroundSize: "cover", backgroundPosition: "center",
                    pointerEvents: "none", // Ensure the background doesn't block interactions
                }}
            />

            <Graphin ref={graphRef} modes={modes} data={{ nodes: props.nodes, edges: props.edges }}
                     style={graphStyle} width={2000} height={1000}
                     layout={{ name: 'force2', options: {} }}
            >
                {selectedElement && <ElementPopover position={popoverPosition} selectedElement={selectedElement}
                                                    onClose={() => setSelectedElement(null)}/>}
                <TopologyTopBar setBackgroundImage={setBackgroundImage}/>
            </Graphin>
        </div>
    );
}
