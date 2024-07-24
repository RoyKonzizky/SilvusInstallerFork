import axios from "axios";

export const fetchCameraLinksData = async () => {
    try {
        const response = await axios.post('http://localhost:8080/get-camera-links');
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Camera Links data:', error);
        return null;
    }
};