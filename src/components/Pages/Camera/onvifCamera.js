var http= require('http');
var Cam = require('onvif').Cam;

new Cam({
    hostname: '192.168.1.88',
    username: 'admin',
    password: 'admin'
}, function(err) {
    this.absoluteMove({x: 1, y: 1, zoom: 1});
    this.getStreamUri({protocol:'RTSP'}, function(err, stream) {
        http.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('<html><body>' +
                '<embed type="application/x-vlc-plugin" target="' + stream.uri + '"></embed>' +
                '</body></html>');
        }).listen(3030);
    });
});