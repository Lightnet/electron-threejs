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
module.exports.initpost = function(){
	//console.log('init post');
	//require('./threejs-engine.js');
	//console.log(connection);//get null since the connect didn't finish setup
}

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
var exts = [
	'.jpg',
	'.png',
	'.jpeg',
	'.gif',
	'.fbx',
	'.dae',
	'.obj',
	'.mtl',
	'.md',
	'.html',
	'.txt',
	'.ts',
	'.js',
	'.json'
];

function fileFilter (req, file, cb) {
	var bmatch = false;
	//console.log(file);
	for(var i in exts) {
		//console.log(exts[i]);
		if( path.extname(file.originalname) == exts[i] ){
			bmatch = true;
			break;
		}
	}
	if(bmatch == false){
		// To reject this file pass `false`, like so:
		console.log('reject file:'+file.originalname);
		bmatch = null;
		cb(null, false);
		return;
	}else{
		// To accept the file pass `true`, like so:
		console.log('pass file');
		bmatch = null;
  		cb(null, true);
		return;
	}
    //cb(new Error('TEST'));
}

//var upload = multer({ dest: 'tmp/' });
var upload = multer({
	dest: 'tmp/',
	fileFilter: fileFilter
});

var projectid = "threejseditor";

var assetfile = {
	name:"",
	projectid: "threejseditor",
	hrashid:"",
	path:"",
	tag:"",
	folder:"assets"
}

	/*
	rethinkdb.dbList().contains('example_database')
	  .do(function(databaseExists) {

	    return rethinkdb.branch(
	      databaseExists,
	      { created: 0 },
	      rethinkdb.dbCreate('example_database');
	    );

	}).run(connection, function(err, result) {
    	if (err) throw err;
    	console.log(JSON.stringify(result, null, 2));
	});
	*/


module.exports.setroute = function(routes,app){
	//app.use(busboy());
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	//app.set('views',path.join(__dirname,'/views'));
	routes.get('/upload', function (req, res) {
		res.contentType('text/html');
		//res.send('Hello World!'); //write string data page
		res.render(__dirname+'/views/upload',{}); //render file .ejs
	});
	routes.post('/file-upload', upload.single('file'),function(req, res, next) {
		//console.log(req.files.file.path);
		//console.log("req.file");
		//console.log(req.file);
		//console.log(req);
		//console.log(req.query.projectid);
		//console.log(req.body);
		//console.log(req);
		if(req.file == null){
			//res.status(500).end('rejected');
			//res.status(204).end();
			res.status(401).end();
			next();
			return;
		}
		//console.log(path.extname(req.file.originalname));
		if(req.file.originalname == 'upload.html'){
			res.status(204).end();
			return;
		}
		if(req.file.originalname == 'dropzone.js'){
			res.status(204).end();
			return;
		}
		if(req.file.originalname == 'dropzonebasic.css'){
			res.status(204).end();
			return;
		}

		//console.log(req.body);
		var file = __dirname + "/public/assets/" + req.file.originalname;
		var fileproject = "/assets/" + req.file.originalname;

		if((rethinkdb !=null)&&(connection !=null)){
			connection.use('test');
			//console.log(rethinkdb);
			//rethinkdb.table('assets').filter(rethinkdb.row('name').eq(req.file.originalname) & ).
			rethinkdb.table('assets').filter(rethinkdb.row('name').eq(req.file.originalname).and( rethinkdb.row('projectid').eq(req.query.projectid)) ).
    			run(connection, function(err, cursor) {
        			if (err) throw err;
        			cursor.toArray(function(err, result) {
            			if (err){
							console.log("err");
							console.log(err);
						};
						if(result.length == 0){
							console.log("Not Found");
							var assetfiletmp = assetfile;
							assetfiletmp.name = req.file.originalname;
							assetfiletmp.hrashid = req.file.filename;
							assetfiletmp.path = fileproject;
							assetfiletmp.projectid = req.query.projectid;
							rethinkdb.table('assets').insert(assetfiletmp).run(connection, function(err, result) {
				    			if (err) throw err;
								console.log("insert asset");
				    			console.log(JSON.stringify(result, null, 2));
							});
						}else{
							console.log("Found Data, Update");
							/*
							var assetfiletmp = assetfile;
							assetfiletmp.name = req.file.originalname;
							assetfiletmp.hrashid = req.file.filename;
							assetfiletmp.path = fileproject;
							rethinkdb.table('assets').
								filter(rethinkdb.row("name").eq(req.file.originalname)).
								update(assetfiletmp).
								run(connection, function(err, result) {
									if (err) throw err;
									//console.log(JSON.stringify(result, null, 2));
								});
							*/
						}
						//display data
            			//console.log(JSON.stringify(result, null, 2));
        			});
    			});

		}

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

module.exports.socketio_connect = function(io, socket){

 	socket.on('getassets',function(data){
		console.log('getassets:'+data);
		if((rethinkdb !=null)&&(connection !=null)){
			connection.use('test');
			rethinkdb.table('assets').filter(rethinkdb.row('projectid').eq(data)).
    			run(connection, function(err, cursor) {
        			if (err) throw err;
        			cursor.toArray(function(err, result) {
            			if (err){
							console.log("err");
							console.log(err);
						};
						//clear data
						socket.emit('assets',{action:'clear'});
						//send assets list
						for (var i = 0; i < result.length;i++){
							console.log(result[i]);
							socket.emit('assets',{
								action:'add',
								id:result[i].id,
								name:result[i].name,
								path:result[i].path,
								tag:result[i].tag
							});
						}
						//display data
            			//console.log(JSON.stringify(result, null, 2));
        			});
    			});
		}
	});

	socket.on('assets', function(data){
		if(data['action'] !=null){
			if(data['action'] == 'rename'){
				var dirpath = __dirname +"/public/";
				var assetspath = "/assets/" + data['name'] ;
				rethinkdb.table('assets').filter(rethinkdb.row('id').eq(data['id']).and( rethinkdb.row('projectid').eq(data['projectid'])) ).
	    			run(connection, function(err, cursor) {
	        			if (err) throw err;
	        			cursor.toArray(function(err, result) {
	            			if (err){
								console.log("err");
								console.log(err);
							};
							if(result.length == 0){
							}else{
								console.log("Found Data, Update");
								rethinkdb.table('assets').
									filter(rethinkdb.row("id").eq(data['id'])).
									update({name:data['name'],path:assetspath}). //set path assets file
									run(connection, function(err, result1) {
										if (err) throw err;
										fs.rename(dirpath + '/assets/' + result[0]['name'], dirpath + "/assets/" + data['name'], function(err) {
						    				if ( err ) console.log('ERROR: ' + err);
											dirpath = null;
											assetspath = null;
											socket.emit('refreshassets',{}); // send refresh list
										});
										//console.log(JSON.stringify(result, null, 2));
									});
							}
							//display data
							//console.log(JSON.stringify(result, null, 2));
						});
					});
			}
			if(data['action'] == 'delete'){
				if((rethinkdb !=null)&&(connection !=null)){
					console.log('DELETE');
					connection.use('test');
					//console.log(data);
					rethinkdb.table('assets').filter(rethinkdb.row('id').eq(data['id'])).
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									//console.log("err");
									//console.log(err);
								};
								console.log();
								rethinkdb.table('assets').get(result[0]['id']).
									delete().
									run(connection, function(err, result1) {
										fs.unlinkSync(__dirname +"/public/"+ result[0]['path']);//delete tmp file once finish
										socket.emit('refreshassets',{});
        								if (err) throw err;
        								console.log(JSON.stringify(result1, null, 2));
    								});
		        			});
		    			});
				}
			}
		}
	});




};
module.exports.socketio_disconnect = function(io, socket){
};

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
