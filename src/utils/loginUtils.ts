import axios from 'axios';

export const fetchLogin = async (ipAddress: string) => {
    try {
        const response = await axios.post('http://localhost:8080/set-radio-ip', {ip: ipAddress}, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
        });
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Login data:', error);
        return null;
    }
};

export const fetchProtectedLogin = async (loginUser: { password: string; username: string }) => {
    try {
        const response = await axios.post('http://localhost:8080/log-in', loginUser, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
        });
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching Radio IP data:', error);
        return null;
    }
};