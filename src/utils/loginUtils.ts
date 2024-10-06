import axios from 'axios';

export const netData = async () => {
    try {
        const response = await axios.get('http://localhost:8080/net-data');
        console.log('Response received:', response.data);
        return JSON.parse(response.data);
    } catch (error) {
        console.error('Error fetching netData:', error);
        return null;
    }
};

export const startUp = async () => {
    try {
        const response = await axios.get('http://localhost:8080/ip');
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching startUp:', error);
        return null;
    }
};

export const fetchProtectedLogin = async (loginUser: { radio_ip: string, password?: string; username?: string }) => {
    let response = null;
    try {
        response = await axios.post('http://localhost:8080/log-in', loginUser);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Protected Login:', error);
        return error;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post('http://localhost:8080/log-out');
        console.log('Response received:', response.data)
    } catch (error) {
        console.error('Error logging out:', error);
    }
}