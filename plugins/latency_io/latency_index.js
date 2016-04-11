/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//Note this base function current set to the plugin module setup
var ProtoBuf = require("protobufjs");
var ByteBuffer = ProtoBuf.ByteBuffer; // ProtoBuf.js uses and also exposes ByteBuffer.js
var Long = ProtoBuf.Long;  // as well as Long.js (not used in this example)

var express = require('express');
var plugin = require('../../app/libs/plugin.js');
var path = require('path');
/*global getModules */
//var io;
//var socket;
//var db;

//===============================================
// Config
//===============================================
module.exports._config = require('./index.json');

// Initialize from .proto file
var builder = ProtoBuf.loadProtoFile(path.join(__dirname, "/public", "example.proto")),
    Message = builder.build("Message");

//===============================================
// Init Post
//===============================================
//module.exports.initpost = function(){
	//console.log('init post');
//}
//===============================================
// Session
//===============================================
/*
module.exports.setBeforeSession = function(app,session,config){
  //console.log('Base Module ');
}
module.exports.setSession = function(app,session,config){
  //console.log('Base Module ');
}
module.exports.setAfterSession = function(app,session,config){
  //console.log('Base Module ');
}
*/
//===============================================
// route
//===============================================

module.exports.setroute = function(routes,app){
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	//app.set('views',path.join(__dirname,'/views'));

	//routes.get('/basemodule', function (req, res) {
		//res.contentType('text/html');
		//res.send('Hello World!');
		//res.render('test',{});
	//});
};

//===============================================
// Socket.io
//===============================================
module.exports.socketio_connect = function(io, socket){
	socket.on('Latency', function () {
		socket.emit('Latency');
	});
};

module.exports.socketio_disconnect = function(io, socket){
};
//===============================================
// Engine.io
//===============================================
module.exports.engineio_connect = function(engineio,socket){
	var smsg = new Message("server message. server");
    socket.send(smsg.toArrayBuffer());
};
module.exports.engineio_message = function(data,socket){
	if(data == 'Latency'){
		socket.send('Latency');
	}
	try {
        var source = new ByteBuffer.wrap(data).flip().readIString();
        console.log(source);
    } catch (err) {
        //console.log("server side...");
        //console.log("Processing failed:", err);
    }
	try {
        // Decode the Message
        var msg = Message.decode(data);
        console.log("Received: " + msg.text);
        // Transform the text to upper case
        //msg.text = msg.text.toUpperCase();
        // Re-encode it and send it back
        //socket.send(msg.toBuffer());
        console.log("Sent: " + msg.text);
    } catch (err) {
        //console.log("server side...");
        //console.log("Processing failed:", err);
    }

    if(data == 'servermsg'){
        var smsg = new Message("request server message");
        socket.send(smsg.toArrayBuffer());
    }
};

module.exports.engineio_close = function(socket){

};
