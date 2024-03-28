import Graphin, {Components, Layout} from '@antv/graphin';
import {useEffect, useState} from "react";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {GraphinNode, GraphinEdge, GraphinData} from "@antv/graphin/es/typings/type";

const {Hull} = Components;

export function Topology() {
    const [hullOptions, setOptions] = useState<(HullCfg)[]>([]);

    const generateRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const data: GraphinData = {nodes: [], edges: []};

    const layout: Layout = {
        type: "dagre",
        // type: 'circular',
        // type: 'graphin-force',
        // center: [200, 200],
        linkDistance: 20,
        nodeStrength: 1000,
        edgeStrength: 200,
        nodeSize: 40,
    };

    for (let i = 0; i < 25; i++) {
        data.nodes.push({
            id: `node-${i}`,
            style: {
                label: {
                    value: `Node ${i}`,
                    fill: '#FFFFFF',
                },
                keyshape: {
                    fill: '#87ff00',
                    stroke: '#87ff00',
                    fillOpacity: 1,
                    size: 50,
                },
            },
        } as GraphinNode);
    }

    for (let i = 0; i < data.nodes.length; i++) {
        const source = data.nodes[i].id;
        const target = data.nodes[generateRandomInt(0, data.nodes.length - 1)].id;
        const labelValue = generateRandomInt(0, 35);
        let color;
        if (labelValue < 10) {
            color = 'red';
        } else if (labelValue > 30) {
            color = 'green';
        } else {
            color = 'yellow';
        }

        data.edges.push({
            source,
            target,
            style: {
                label: {
                    value: `${labelValue}`,
                    fill: color,
                    fontSize: 30
                },
                keyshape: {
                    endArrow: {
                        path: '',
                    },
                    stroke: color,
                    lineWidth: 6
                },
            },
        } as GraphinEdge);
    }

    const defaultNode = {
        defaultNode: {
            style: {
                label: {
                    fill: "#ffffff",
                },
            },
        }
    };

    const graphinProps = {
        zoom: {
            min: 0.5,
            max: 2,
        },
    };

    const modes = {
        default: ['drag-node', 'drag-canvas', 'zoom-canvas', 'click-select',
            {
                type: 'tooltip',
                formatText(model) {
                    const text = 'ID: ' + model.id;
                        // + '<br/> class: ' + model.class;
                    return text;
                },
                shouldUpdate: e => {
                    return true;
                }
            },
            {
                type: 'edge-tooltip',
                formatText(model) {
                    const text = 'source: ' + model.source
                        + '<br/> target: ' + model.target;
                        // + '<br/> weight: ' + model.weight;
                    return text;
                },
                shouldUpdate: e => {
                    return true;
                }
            }
        ]
    };

    // graph.on('node:click', e => {
    //     const clickNodes = graph.findAllByState('node', 'click');
    //     clickNodes.forEach(cn => {
    //         graph.setItemState(cn, 'click', false);
    //     });
    //     const nodeItem = e.item;
    //     graph.setItemState(nodeItem, 'click', true);
    // });
    // graph.on('edge:click', e => {
    //     const clickEdges = graph.findAllByState('edge', 'click');
    //     clickEdges.forEach(ce => {
    //         graph.setItemState(ce, 'click', false);
    //     });
    //     const edgeItem = e.item;
    //     graph.setItemState(edgeItem, 'click', true);
    // });

    useEffect(() => {
        console.log(data);
        setOptions([
            {
                members: ['node-2', 'node-1', 'node-3'],
            },
            {
                members: ['node-5', 'node-4']
            }
        ]);
    }, []);

    return (
        <div className={'w-full h-full'}>
            <Graphin style={{background: 'black'}} data={data} layout={layout}
                     defaultNode={defaultNode}
                     modes={modes} {...graphinProps}>
                <Hull options={hullOptions}/>
            </Graphin>
        </div>
    );
}
