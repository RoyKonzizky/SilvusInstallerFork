import axios from "axios";

export const sendNames = async (nodeId: string, nodeName: string) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/set-label',
            {id: Number(nodeId), label: nodeName},
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