import axios from 'axios';

export type startUpDataType = {type: string, msg: string | {ip: string, isProtected: number}};

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

export const startUp = async () => {
    try {
        const response = await axios.post('http://localhost:8080/start-up');
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};