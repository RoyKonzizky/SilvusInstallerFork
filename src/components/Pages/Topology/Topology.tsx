import {ITopologyProps} from "./ITopologyProps.ts";
import {TopologyGraph} from "./graph/TopologyGraph.tsx";
import {generateData} from "../../../utils/topologyUtils/graphSetup.ts";

export function Topology(props: ITopologyProps) {
    const graphData = generateData();

    return (
        <div className={`${props.isSmaller ? "w-[35%] h-[35%]" :
            "w-full h-full border border-black bg-black"} block absolute overflow-hidden`}>
            <TopologyGraph graphData={graphData}/>
        </div>
    );
}
