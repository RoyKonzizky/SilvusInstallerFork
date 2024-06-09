import axios from 'axios';

export const fetchBasicSettingsData = async () => {
    try {
        const response = await axios.get('http://localhost:8080/basic-settings');
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};