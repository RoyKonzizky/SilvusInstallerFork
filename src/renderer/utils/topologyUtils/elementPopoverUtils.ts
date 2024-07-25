import axios from "axios";

export const sendNames = async (nodeId: number, nodeName: string) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/set-ptt-groups',
            {id: nodeId, name: nodeName},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Response received:', response.data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};