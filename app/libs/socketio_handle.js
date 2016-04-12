var plugin = require('./plugin.js');
module.exports = function (io) {
    console.log("[ = init socket.io = ]");
    io.on('connection', function (socket) {
        console.log('socket.io user connected');
        plugin.Call_SocketIO_Connection(io, socket);
        socket.on('ping', function () {
            socket.emit('pong');
        });
        socket.on('disconnect', function (data) {
            console.log('socket.io disconnect message: ' + data);
            plugin.Call_SocketIO_Disconect(io, socket);
        });
    });
};
