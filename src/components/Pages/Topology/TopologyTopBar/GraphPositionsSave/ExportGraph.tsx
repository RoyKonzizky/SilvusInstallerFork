import {IUserNode} from "@antv/graphin";
import exportGraphIcon from "../../../../../assets/exportGraph.jpg";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../redux/store.ts";
import axios from "axios";
import {toast} from "react-toastify";

export function ExportGraph() {
    const selectorNodes = useSelector((state: RootState) => state.topologyGroups.nodes);
    const { t } = useTranslation();

    const exportNodes = async (nodes: IUserNode[]) => {
        const nodePositions = nodes.map((node) => ({
            id: Number(node.id),
            ip: node.data.ip,
            pos: [node.x as number, node.y as number],
        }));

        // Wrap in 'device_list' to match server expectations
        const payload = { device_list: nodePositions };
        try {
            await axios.post('http://localhost:8080/topology', payload);
            toast.success(t("exportGood"));
        } catch (error) {
            toast.error(t("exportBad"));
        }
    };

    return(
        <button className={'h-14 w-14 mt-5 rounded-full border border-white'} onClick={() => exportNodes(selectorNodes)}>
            <img className={'bg-white h-9 w-9 block mx-auto border-0'} src={exportGraphIcon} alt={t('export')} />
        </button>
    );
}