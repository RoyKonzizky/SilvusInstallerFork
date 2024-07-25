import axios from 'axios';

export const fetchBasicSettingsData = async () => {
    try {
        const response = await axios.post('http://localhost:8080/basic-settings');
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Basic Settings data:', error);
        return null;
    }
};

export const setBasicSettingsData = async (isSaveNetwork: boolean, frequency: number, bandwidth: string, networkId: string, totalTransitPower: number) => {
    try {
        const response = await axios.post('http://localhost:8080/basic-settings', {
            set_net_flag: isSaveNetwork ? 1 : 0,
            frequency: frequency,
            bw: bandwidth,
            net_id: networkId,
            power_dBm: totalTransitPower
        });
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error setting Basic Settings data:', error);
        return null;
    }
};