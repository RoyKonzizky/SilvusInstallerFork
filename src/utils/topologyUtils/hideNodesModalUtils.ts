import {IUserNode} from "@antv/graphin";
import axios from "axios";

export const hideNode = async (node: IUserNode) => {
    try {
        await axios.post(`http://localhost:8080/hide/`, {
            device_id: Number(node.id)
        });
    }
    catch (e) {
        console.error("Visibility change failed: ", e);
    }
}