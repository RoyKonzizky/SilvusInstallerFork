import importGraphIcon from "../../../../../assets/importGraph.jpg";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {updateNodes} from "../../../../../redux/TopologyGroups/topologyGroupsSlice.ts";
import axios from "axios";
import {toast} from "react-toastify";
import {RootState} from "../../../../../redux/store.ts";

export function ImportGraph() {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const topologySelector = useSelector((state: RootState) => state.topologyGroups)

    // function nodeToDevice(nodes: {id: number, ip: string, pos: [x: number, y: number]}[]) {
    //     const devices: devicesType = [];
    //     nodes.map((node) => {
    //         devices.push({ip: node.ip, id: node.id.toString(), status: [1], name: node.ip, percent: 'N/A'})
    //     });
    //     return devices;
    // }

    const importNodes = async () => {
        try {
            const { data } = await axios.get('http://localhost:8080/topology');
            const nodesFromServer = data.device_list;

            if (!nodesFromServer || !Array.isArray(nodesFromServer)) {
                toast.error(t("importBad"));
            }
            // else {
            //     console.log(nodesFromServer);
            // }

            const nodesAfterImport = topologySelector.nodes.map(nodeFromStore => {
                const matchingNode = nodesFromServer.find((nodeFromServer: any) =>
                    nodeFromServer.id === Number(nodeFromStore.id));
                // console.log(nodeFromStore);
                // console.log(matchingNode);
                if (!matchingNode) {
                    return nodeFromStore; // Keep the original node if no match is found
                }
                const newNode = {
                    ...nodeFromStore,
                    x: matchingNode.pos[0],
                    y: matchingNode.pos[1],
                };
                // console.log(newNode);
                return newNode;
            });

            dispatch(updateNodes(nodesAfterImport));
            toast.success(t("importGood"));
        } catch (error) {
            console.error('Error during import', error);
            toast.error(t("importBad"));
        }
    };

    return (
        <button className={'h-14 w-14 mt-5 rounded-full border border-white'} onClick={importNodes}>
            <img className={'bg-white h-9 w-9 block mx-auto border-0'} src={importGraphIcon} alt={t('import')}/>
        </button>
    );
}