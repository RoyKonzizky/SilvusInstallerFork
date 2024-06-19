import http from 'http';
import ffmpeg from 'fluent-ffmpeg';

const server = http.createServer((req, res) => {
    console.log('Client connected');
    res.writeHead(200, { 'Content-Type': 'video/x-flv' });

    const stream = ffmpeg('rtsp://172.20.245.64:554/av0_0')
        .format('flv')
        .pipe();

    stream.on('data', function(data) {
        res.write(data);
    });

    stream.on('end', function() {
        res.end();
    });

    stream.on('error', function(err) {
        console.error('An error occurred: ', err.message);
        res.end();
    });
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});
