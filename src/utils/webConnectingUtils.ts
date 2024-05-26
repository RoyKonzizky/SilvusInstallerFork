import axios from 'axios';

const sendDataToServer = async (data:{groups:string[], selectedOptions: {[p: string]: {[p: string]: number}}}) => {
    try {
        await axios.post('your-server-url', data);
        console.log('Data sent successfully');
    } catch (error) {

        console.error('Error sending data:', error);
    }
};
// sendDataToServer({ groups: groups, selectedOptions: selectedOptions });

const fetchBatteryData = async () => {
    try {
        const response = await axios.get('your-server-url');
        const batteryData = response.data;
        console.log('Battery data received:', batteryData);
        return batteryData;
    } catch (error) {
        console.error('Error fetching battery data:', error);
        return null;
    }
};
// fetchBatteryData().then((batteryData) => {
//     // Handle the received battery data
// });
