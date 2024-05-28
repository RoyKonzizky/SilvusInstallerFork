import axios from 'axios';

export const fetchRadioIpData = async () => {
    try {
        const response = await axios.get('your-server-url/net_data');
        const radioIpData = response.data["radio_ip"];
        console.log('Radio IP received:', radioIpData);
        return radioIpData;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};