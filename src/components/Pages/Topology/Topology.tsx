// @ts-ignore
import Graph from "react-vis-network-graph";
import "./styles/network.css";

export function Topology() {
    const graph = {
        nodes: [
            {id: 1, title: "1", isConnected: true, color: 'green'},
            {id: 2, title: "2", isConnected: false, color: 'green'},
            {id: 3, title: "3", isConnected: true, color: 'green'},
            {id: 4, title: "4", isConnected: false, color: 'green'},
            {id: 5, title: "5", isConnected: true, color: 'green'},
            {id: 6, title: "6", isConnected: false, color: 'green'}
        ],
        edges: [
            {from: 1, to: 2, label: "5", title: "Edge weight: 5", color: ""},
            {from: 1, to: 3, label: "5", title: "Edge weight: 5", color: ""},
            {from: 2, to: 4, label: "10", title: "Edge weight: 10", color: ""},
            {from: 2, to: 5, label: "10", title: "Edge weight: 10", color: ""},
            {from: 2, to: 6, label: "25", title: "Edge weight: 25", color: ""},
            {from: 6, to: 1, label: "25", title: "Edge weight: 25", color: ""},
            {from: 5, to: 6, label: "25", title: "Edge weight: 25", color: ""}
        ]
    };

    const options = {
        physics: false,
        layout: {
            hierarchical: false
        },
        edges: {
            width: 3,
            arrows: {
                to: {enabled: false}
            },
        },
    };

    const events = {
        select: function (event: { nodes: any; edges: any; }) {
            const {nodes, edges} = event;
            console.log(edges);
            console.log(nodes);
        }
    };

    // Custom edge rendering function to include tooltips
    // const customEdgeRenderer = (props: { edge: { from: any; to: any; title: any; }; }) => {
    //     const {from, to, title} = props.edge;
    //     return (
    //         <div title={title}>
    //             <div>Edge from {from} to {to}</div>
    //         </div>
    //     );
    // };

    const edgeConnectionAsColor = (label: string) => {
        const value = parseInt(label);
        if (value < 10) {
            return "red";
        } else if (value < 20) {
            return "yellow";
        } else {
            return "green";
        }
    };

    // Assign colors to edges based on label value
    graph.edges.forEach(edge => {
        edge.color = edgeConnectionAsColor(edge.label);
        edge.title = (edge.from + ', ' + edge.to + ', ' + edge.label).toString();
    });

    // Custom node rendering function to include tooltips
    // const customNodeRenderer = (props) => {
    //     const {id, label} = props.node;
    //     return (
    //         <div title={`Node ${id}`}>
    //             <div>Node: {label}</div>
    //         </div>
    //     );
    // };

    const nodeConnectionAsColor = (isConnected: Boolean) => {
        if (isConnected)
            return "green";
        else {
            return "red";
        }
    };

    // Assign colors to edges based on label value
    graph.nodes.forEach(node => {
        node.color = nodeConnectionAsColor(node.isConnected);
        node.title = (node.id + ', ' + node.isConnected).toString();
    });

    return (
        <div className={'h-full w-full'}>
            <Graph
                graph={graph}
                options={options}
                events={events}
                // getNetwork={(network) => {
                //     //  if you want access to vis.js network api you can set the state in a parent component using this property
                // }}
                // edgeRenderer={customEdgeRenderer}
                // nodeRenderer={customNodeRenderer}
            />
        </div>
    );
}
