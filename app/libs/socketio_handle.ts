/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

// <reference path="../../DefinitelyTyped/cryptojs/cryptojs.d.ts" />
var plugin = require('./plugin.js');
//var fs = require('fs');
//var path = require('path');
//var crypto = require('crypto');
module.exports = function(io){
	console.log("[ = init socket.io = ]");
    io.on('connection', function(socket){// client listen when connect with the user client web browser
        console.log('socket.io user connected');
		plugin.Call_SocketIO_Connection(io, socket);
		socket.on('ping', function(){
			socket.emit('pong');
		});
		socket.on('disconnect', function(data){
			console.log('socket.io disconnect message: ' + data);
			plugin.Call_SocketIO_Disconect(io, socket);
		})
    });
	//console.log("[ = socket.io config... = ]");
};
