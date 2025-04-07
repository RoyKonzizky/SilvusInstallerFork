import {useSelector} from "react-redux";
import {Checkbox} from "antd";
import { IUserNode } from "@antv/graphin";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import axios from "axios";
import {useTranslation} from "react-i18next";
import refreshIcon from "../../../../../assets/refresh.svg";
import {createNodesFromData} from "../../../../../utils/topologyUtils/graphUtils.ts";
import {hideNode} from "../../../../../utils/topologyUtils/hideNodesModalUtils.ts";
import {RootState} from "../../../../../redux/store.ts";

export function HideNodesChecklist() {
    const selector = useSelector((state: RootState) => state.topologyGroups);
    const [nodesCheckBoxArray, setNodesCheckBoxArray] =
        useState<{ node: IUserNode; isChecked: boolean }[]>([]);
    const [isSpin, setIsSpin] = useState(false);
    const { t} = useTranslation();
    const selectorIP = useSelector((state: RootState) => state.ip);

    const handleCheckboxChange = async (node: IUserNode) => {
        setNodesCheckBoxArray(prevState =>
            prevState.map(item =>
                item.node.id === node.id ? { ...item, isChecked: !item.isChecked } : item
            )
        );
        try {
            await hideNode(node);

            await axios.post(`http://localhost:8080/unhide`, {
                device_ids: nodesCheckBoxArray
                    .filter(item => item.isChecked)
                    .map(item => Number(item.node.id))
            });

            toast.success(t("nodesVisibilityChangeSuccess"));
        } catch (e) {
            toast.error(t("nodesVisibilityChangeFailure"));
        }
    };

    const handleRefreshClick = async () => {
        setIsSpin(true);
        setTimeout(() => {
            getHiddenNodes();
        },2000);
    };
    const getHiddenNodes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/hidden');
            const hiddenNodes = response.data.device_list || [];

            const nodesFromHidden = createNodesFromData(hiddenNodes, selector.sizeInterval, selectorIP.ip_address);

            const updatedNodes = [...selector.nodes, ...nodesFromHidden].filter(
                (node, index, self) =>
                    self.findIndex(n => n.id === node.id) === index // Remove duplicates
            );

            setNodesCheckBoxArray(
                updatedNodes.map(node => ({
                    node,
                    isChecked: hiddenNodes.find((value: {pos: number[], ip: string, id: number}) =>
                        Number(value.id)===Number(node.id)),
                }))
            );

            toast.success(t("nodesVisibilityChangeSuccess"));
        } catch (error) {
            toast.error(t("nodesVisibilityChangeFailure"));
        } finally {
            setIsSpin(false);
        }
    };

    useEffect(() => {
        getHiddenNodes();
    }, []);

    return (
        <div>
            <div>
                {nodesCheckBoxArray.filter(item => item.node.data.ip != selectorIP.ip_address).map((item) => (
                    <div className={'text-lg'} key={item.node.id}>
                        {item.node.style?.label?.value}:
                        <Checkbox style={{ transform: "scale(1.5)", marginLeft: "1rem" }}
                                  checked={item.isChecked}
                                  onChange={() => handleCheckboxChange(item.node)}
                        />
                    </div>
                ))}
            </div>
            <div className={'w-20 flex justify-evenly ml-[90%]'}>
                <div style={{display: 'flex'}}>
                    <button onClick={handleRefreshClick} style={{width: 'fit-content'}}>
                        <img src={refreshIcon} alt={'refresh icon'}
                             className={`${isSpin ? 'rotate-animation' : ''} w-5 h-5`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
