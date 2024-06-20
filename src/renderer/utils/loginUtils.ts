import axios from 'axios';

export const fetchLogin = async (ipAddress: string) => {
    try {
        const response = await axios.post('http://localhost:8080/set-radio-ip', {radio_ip: ipAddress});
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Login data:', error);
        return null;
    }
};

export const fetchProtectedLogin = async (loginUser: { password: string; username: string }) => {
    try {
        const response = await axios.post('http://localhost:8080/log-in', loginUser);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};