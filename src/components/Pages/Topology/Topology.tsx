import Graphin, {Components, Layout, Utils} from '@antv/graphin';
import {useEffect, useState} from "react";
import {HullCfg} from "@antv/graphin/lib/components/Hull";

const { Hull, Tooltip } = Components;

export function Topology() {

    const [hullOptions, setOptions] =  useState<(HullCfg)[]>([]);

    const generateRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const data = Utils.mock(1).circle().graphin();
    const layout: Layout = {
        type: 'force2',
        // center: [200, 200],
        linkDistance: 20,
        nodeStrength: 1000,
        edgeStrength: 200,
        nodeSize: 40,
    };

    for (let i = 1; i < 26; i++) {
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
        });
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
        });
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
        default: ['drag-node', 'drag-canvas', 'zoom-canvas'],
    };

    useEffect(() => {
        console.log(data);
        setOptions([
            {
                members: ['node-6', 'node-1', 'node-3'],
            },
            {
                members: ['node-5', 'node-4']
            }
        ]);
    }, []);

    return (
        <div className={'w-full h-full'}>
            <Graphin style={{ background: 'black' }} data={data} layout={layout} defaultNode={defaultNode} modes={modes} {...graphinProps}>
                <Hull options={hullOptions} />
                <Tooltip bindType="node">
                    {(node: any) => {
                        return <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px' }}>{node.id}</div>;
                    }}
                </Tooltip>
                <Tooltip bindType="edge">
                    {(edge: any) => {
                        return <div style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: '4px' }}>Edge Label Value: {edge.model.tooltip}</div>;
                    }}
                </Tooltip>
            </Graphin>
        </div>
    );
}
