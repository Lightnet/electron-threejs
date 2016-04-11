/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//Note this base function current set to the plugin module setup
var path = require('path');
var express = require('express');
var plugin = require('../../app/libs/plugin.js');
var fs = require('fs');
var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });
var upload = multer({ dest: 'tmp/' });
//var upload = multer();
//var busboy = require('connect-busboy');
/*global getModules */
//var io;
//var socket;
//var db;

//===============================================
// Config
//===============================================
module.exports._config = require('./index.json');
//===============================================
// Init Post
//===============================================
//module.exports.initpost = function(){
	//console.log('init post');
	//require('./threejs-engine.js');
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
	//app.use(busboy());
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	app.set('views',path.join(__dirname,'/views'));
	//routes.get('/rts', function (req, res) {
		//res.contentType('text/html');
		//res.send('Hello World!'); //write string data page
		//res.render('threejs-rts',{}); //render file .ejs
	//});
	routes.post('/file-upload', upload.single('file'),function(req, res) {
		//console.log(req.files.file.path);
		//console.log(req.file);
		//console.log(req.body);
		var file = __dirname + "/public/" + req.file.originalname;
		fs.readFile( req.file.path, function (err, data) {
	        fs.writeFile(file, data, function (err) {
	         if( err ){
	              console.log( err );
	         }else{
				 fs.unlinkSync(req.file.path);//delete tmp file once finish
	               response = {
	                   message:'File uploaded successfully',
	                   filename:req.file.originalname
	              };
	          }
	          //console.log( response );
	          res.end( JSON.stringify( response ) );
	       });
	   });
  		//console.log(req.files);
		//res.status(204).end()
	});
};

//===============================================
// Socket.io
//===============================================
/*
module.exports.socketio_connect = function(io, socket){
};
module.exports.socketio_disconnect = function(io, socket){
};
*/
//===============================================
// Engine.io
//===============================================
/*
module.exports.engineio_connect = function(engineio,socket){

};
module.exports.engineio_message = function(data,socket){

};
module.exports.engineio_close = function(socket){

};
*/
