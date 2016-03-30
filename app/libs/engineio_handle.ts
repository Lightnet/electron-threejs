/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

var plugin = require('./plugin.js');
//var fs = require('fs');
//var path = require('path');
module.exports = function(engine_io){
	console.log("[ = init engine.io = ]");
    engine_io.on('connection', function (socket) {
        console.log("engine.io user connected...");
        plugin.call_engineio_connect(engine_io, socket);
        socket.send('ping');
        socket.on('message', function(data){
			//console.log(data);
            plugin.call_engineio_message(data, socket);
        });
        socket.on('close', function(){
            plugin.call_engineio_close(socket);
            console.log("engine.io user close");
        });
        //socket.send('utf 8 string');
        //socket.send(new Buffer([0, 1, 2, 3, 4, 5])); // binary data
        //console.log(new Buffer([0, 1, 2, 3, 4, 5]));
        //socket.send(new test()); // binary data
    });
};
