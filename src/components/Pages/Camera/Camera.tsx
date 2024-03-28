import {useState, /* useEffect */} from 'react';
//import {Discovery} from 'onvif';

export function Camera() {
    const [devices, /*setDevices*/] = useState<any[]>([]);
/*
    useEffect(() => {
        // Discover ONVIF devices on the network
        Discovery.probe((err: any, devices: any[]) => {
            if (err) {
                console.error('Error discovering ONVIF devices:', err);
            } else {
                console.log('Discovered ONVIF devices:', devices);
                // Perform further actions, such as fetching streams or controlling PTZ
            }
        });
    }, []);
*/
    return (
        <div>
            <h2>Discovered Devices</h2>
            <ul>
                {devices.map((device, index) => (
                    <li key={index}>
                        {/* Render device information */}
                        <div>Name: {device.name}</div>
                        <div>Manufacturer: {device.manufacturer}</div>
                        {/* Add more device information as needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
}