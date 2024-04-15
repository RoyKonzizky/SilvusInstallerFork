import {NodeConfig} from "@antv/g6-core/lib/types";
import {EdgeConfig} from "@antv/g6";

export function getDefaultNodeConfig(): NodeConfig {
    return {
        id: "",
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
    };
}

export function getDefaultEdgeConfig(): EdgeConfig {
    return {
        style: {
            stroke: '#e2e2e2',
            lineWidth: 2,
        },
        labelCfg: {
            // position: 'top ',
            style: {
                fill: '#ffffff',
                fontSize: 30,
            },
        },
    };
}
