import {NodeConfig} from "@antv/g6-core/lib/types";
import {ComboConfig, EdgeConfig} from "@antv/g6";

export function getDefaultNodeConfig(): NodeConfig {
    return {
        id: "",
        size: 15,
        style: {
            fill: '#319428',
            stroke: '#319428',
        },
        labelCfg: {
            position: 'bottom',
            style: {
                fill: '#ffffff',
                fontSize: 10,
            },
        },
    };
}

export function getDefaultEdgeConfig(): EdgeConfig {
    return {
        style: {
            stroke: '#e2e2e2',
            lineWidth: 3,
        },
        labelCfg: {
            // position: 'top',
            style: {
                fill: '#ffffff',
                fontSize: 7,
            },
        },
    };
}

export function getDefaultComboConfig(): ComboConfig {
    return {
        id: "",
        size: [100, 100],
        color: '#5B8FF9',
        style: {
            lineWidth: 2,
            fillOpacity: 0.1,
        },
        labelCfg: {
            position: 'top',
            style: {
                fill: '#ffffff',
                fontSize: 10,
            },
        },
    };
}
