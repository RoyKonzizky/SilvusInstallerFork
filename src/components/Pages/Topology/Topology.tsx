import {useEffect, useRef} from 'react';
import G6, {EdgeConfig, Graph, Item} from '@antv/g6';
import {NodeConfig} from '@antv/g6-core/lib/types';

export function Topology() {
    const container = useRef(null);
    let graph: Graph | null = null;

    useEffect(() => {
        if (!graph) {
            graph = new G6.Graph({
                container: container.current!,
                width: 800,
                height: 600,
                modes: {
                    default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'click-select'],
                },
                defaultNode: {
                    size: 50,
                    style: {
                        fill: '#319428',
                        stroke: '#319428',
                    },
                    labelCfg: {
                        position: 'bottom',
                        style: {
                            fill: '#ffffff',
                            fontSize: 20,
                        },
                    },
                },
                defaultEdge: {
                    style: {
                        stroke: '#e2e2e2',
                        lineWidth: 2,
                    },
                    labelCfg: {
                        position: 'top ',
                        style: {
                            fill: '#ffffff',
                            fontSize: 20,
                        },
                    },
                },
            });

            const data = {
                nodes: [] as NodeConfig[],
                edges: [] as EdgeConfig[],
            };

            for (let i = 0; i < 25; i++) {
                data.nodes.push({
                    id: `node-${i}`,
                    x: Math.random() * 800,
                    y: Math.random() * 600,
                    label: `Node-${i}`,
                });
            }

            for (let i = 0; i < data.nodes.length; i++) {
                const source = data.nodes[i].id;
                const target = data.nodes[Math.floor(Math.random() * data.nodes.length)].id;
                const labelValue = Math.floor(Math.random() * 35);
                let color;
                if (labelValue < 10) {
                    color = '#f00';
                } else if (labelValue > 30) {
                    color = '#17a617';
                } else {
                    color = '#deb600';
                }

                data.edges.push({
                    id: `edge-${i}`,
                    source,
                    target,
                    label: `${labelValue}`,
                    style: {
                        stroke: color,
                        lineWidth: 6,
                    },
                });
            }

            graph.data(data);
            graph.render();

            const tooltip = new G6.Tooltip({
                container: graph.get('container'),
                offset: 10,
                itemTypes: ['node', 'edge'],
                getContent: (e) => {
                    if (e?.item?.getType() === 'node') {
                        return `<div><strong>${e.item.getModel().id}</strong></div>`;
                    } else {
                        return `<div>
                                    <strong>${e?.item?.getModel().source}</strong> ->
                                    <strong>${e?.item?.getModel().target}</strong><br/>
                                    <strong>Label:</strong> ${e?.item?.getModel().label}
                                </div>`;
                    }
                },
                trigger: 'click',
            });
            graph.addPlugin(tooltip);

            graph.on('node:click', (e) => {
                const item = e.item;
                console.log('Clicked Node:', item?.getModel().id);
                graph?.setAutoPaint(false);
                graph?.getNodes().forEach((node) => {
                    graph?.setItemState(node, 'selected', false);
                });
                graph?.setItemState(item as Item, 'selected', true);
                graph?.setAutoPaint(true);
            });

            graph.on('edge:click', (e) => {
                const item = e.item;
                console.log('Clicked Edge:', item?.getModel().id);
                graph?.setAutoPaint(false);
                graph?.getEdges().forEach((edge) => {
                    graph?.setItemState(edge, 'selected', false);
                });
                graph?.setItemState(item as Item, 'selected', true);
                graph?.setAutoPaint(true);
            });
        }

        return () => {
            if (graph) {
                graph.destroy();
                graph = null;
            }
        };
    }, []);

    return (
        <div className={"w-full h-full bg-black text-white"}>
            <div ref={container} className={"bg-black text-white"}/>
        </div>
    );
}