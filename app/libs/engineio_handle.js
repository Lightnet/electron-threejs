var plugin = require('./plugin.js');
module.exports = function (engine_io) {
    console.log("[ = init engine.io = ]");
    engine_io.on('connection', function (socket) {
        console.log("engine.io user connected...");
        plugin.call_engineio_connect(engine_io, socket);
        socket.send('ping');
        socket.on('message', function (data) {
            plugin.call_engineio_message(data, socket);
        });
        socket.on('close', function () {
            plugin.call_engineio_close(socket);
            console.log("engine.io user close");
        });
    });
};
