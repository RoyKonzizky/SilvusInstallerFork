import Graphin, {Components, Layout} from '@antv/graphin';
import {useEffect, useState} from "react";
import {HullCfg} from "@antv/graphin/lib/components/Hull";
import {GraphinData} from "@antv/graphin/es/typings/type";
import {GraphinEdge} from "@antv/graphin/lib/typings/type";

const {Hull} = Components;

export function Topology() {
    const [hullOptions, setHullOptions] = useState<HullCfg[]>([]);

    const generateRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const nodeArr = [];
    const edgeArr = [];

    for (let i = 0; i < 25; i++) {
        nodeArr.push({
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
        });
    }

    for (let i = 0; i < nodeArr.length; i++) {
        const source = nodeArr[i].id;
        const target = nodeArr[generateRandomInt(0, nodeArr.length - 1)].id;
        const labelValue = generateRandomInt(0, 35);
        let color;
        if (labelValue < 10) {
            color = 'red';
        } else if (labelValue > 30) {
            color = 'green';
        } else {
            color = 'yellow';
        }

        edgeArr.push({
            source,
            target,
            label: `${labelValue}`,
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
        });
    }

    const data: GraphinData = {nodes: nodeArr, edges: edgeArr};

    const layout: Layout = {
        type: "force2",
        linkDistance: 20,
        nodeStrength: 1000,
        edgeStrength: 200,
        nodeSize: 40,
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

    const graphinProps = {
        zoom: {
            min: 0.5,
            max: 2,
        },
    };

    const handleClick = (event: {
        item: { getType: () => string; getModel: () => { id: string; label?: string } }
    }) => {
        const {item} = event;
        const type = item.getType();
        const model = item.getModel();

        if (type === 'node') {
            // Show tooltip for node
            console.log('Clicked Node:', model.id);
            // Implement your tooltip logic here
        } else if (type === 'edge') {
            // Show tooltip for edge
            console.log('Clicked Edge:', `${(model as unknown as GraphinEdge).source + ' -> ' + (model as unknown as GraphinEdge).target}`);
            // Implement your tooltip logic here
        }
    };

    const modes = {
        default: ['drag-node', 'drag-canvas', 'zoom-canvas',
            {
                type: 'tooltip',
                formatText(model: { id: string; }) {
                    return 'Id: ' + model.id;
                },
            },
            {
                type: 'edge-tooltip',
                formatText(model: { source: string; target: string; label: string; }) {
                    return 'Source: ' + model.source +
                        '<br/> Target: ' + model.target +
                        '<br/> Label: ' + model.label;
                },
            },
            {
                type: 'click-select',
                selectNode: true,
                selectEdge: true,
            },
            {
                type: 'click-select',
                onClick: handleClick,
            },
        ]
    };


    useEffect(() => {
        console.log(data);
        setHullOptions([
            {
                members: ['node-2', 'node-1', 'node-3'],
            },
            {
                members: ['node-5', 'node-4'],
            }
        ]);
    }, []);

    return (
        <div className={'w-full h-full'}>
            <Graphin style={{background: 'black'}} data={data} layout={layout}
                     defaultNode={defaultNode}
                     modes={modes}
                     {...graphinProps}>
                <Hull options={hullOptions}/>
            </Graphin>
        </div>
    );
}
