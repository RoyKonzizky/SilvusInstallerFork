import G6, {Graph} from "@antv/g6";

export function tooltipInit(graph: Graph) {
    return new G6.Tooltip({
        container: graph.get('container'),
        offset: 10,
        itemTypes: ['node', 'edge'],
        getContent: (e) => {
            if (e?.item?.getType() === 'node') {
                return `<div class="select-none"><strong>${e.item.getModel().id}</strong></div>`;
            } else {
                return `<div class="select-none">
                                    <strong>${e?.item?.getModel().source}</strong> ->
                                    <strong>${e?.item?.getModel().target}</strong><br/>
                                    <strong>Label:</strong> ${e?.item?.getModel().label}
                                </div>`;
            }
        },
        trigger: 'click',
    });
}