import {useEffect, useState} from 'react';

export function Camera() {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const socket = new WebSocket('https://www.youtube.com/watch?v=41OKbAP3BgA'); // should be ws link, but I don't have one, so I put https link lol

        socket.onopen = () => {
            console.log('Connected to RTSP server');
        };

        socket.onmessage = (event) => {
            // Handle incoming video data
            const videoData = event.data;
            // For simplicity, assuming the video data is a URL pointing to a video file
            setVideoUrl(videoData);
        };

        socket.onclose = () => {
            console.log('Connection closed');
        };

        socket.onerror = (error) => {
            console.error('Socket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            {videoUrl ? (
                <video controls>
                    <source src={videoUrl} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Waiting for video stream...</p>
            )}
        </div>
    );
}