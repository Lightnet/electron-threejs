/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//Note this base function current set to the plugin module setup
var fs = require('fs');
var path = require('path');
var express = require('express');
var plugin = require('../../app/libs/plugin.js');
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
	//console.log('Base Module ');
	//add current dir plugin public folder
	app.use(express.static(__dirname + '/public'));
	//add current dir plugin views folder
	app.set('views',path.join(__dirname,'/views'));

	routes.get('/threejs-rpg', function (req, res) {
		res.contentType('text/html');
		//res.send('Hello World!'); //write string data page
		res.render('threejs-rpg',{}); //render file .ejs
	});
};
//===============================================
// Socket.io
//===============================================

module.exports.socketio_connect = function(io, socket){
	socket.on('mapscene',function(data){
		console.log('mapscene?');
		if(data != null){
			console.log('mapscene');
			if(data['action'] == 'save'){
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					rethinkdb.table('mapscene').filter(rethinkdb.row('uuid').eq(data.uuid).and( rethinkdb.row('projectid').eq(data.projectid)) ).
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									console.log("err");
									console.log(err);
								};
								if(result.length == 0){//if file not found in the list add to table
									console.log("Not Found");
									var mapscenedata = {
										projectid:data.projectid,
										uuid:data.uuid,
										object:data.object,
									}
									rethinkdb.table('mapscene').insert(mapscenedata).run(connection, function(err, result) {
						    			if (err) throw err;
										console.log("insert mapscene");
						    			console.log(JSON.stringify(result, null, 2));
										mapscenedata = null;
									});
								}else{//else update //need to change this.
									console.log("Found Data, Update");
									var mapscenedata = {
										object:data.object,
									}
									rethinkdb.table('mapscene').
										filter(rethinkdb.row("uuid").eq(data.uuid)).
										update(mapscenedata).
										run(connection, function(err, result) {
											if (err) throw err;
											//console.log(JSON.stringify(result, null, 2));
										});

								}
								//display data
		            			//console.log(JSON.stringify(result, null, 2));
		        			});
		    			});
				}
			}
			if(data['action'] == 'loadmapscene'){
				console.log('loadmapscene');
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					rethinkdb.table('mapscene').filter(   rethinkdb.row('projectid').eq(data.projectid)   ).
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									console.log("err");
									console.log(err);
								};
								socket.emit('mapscene',{action:'clear'});
								if(result.length > 0){
									for(var i = 0; i < result.length;i++){
										socket.emit('mapscene',{action:'add',uuid:result[i].uuid, object:result[i].object});
									}
								}
								socket.emit('mapscene',{action:'finish'});
								//display data
		            			//console.log(JSON.stringify(result, null, 2));
		        			});
		    			});
				}

			}
			if(data['action'] == 'delete'){
				console.log('delete');
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					rethinkdb.table('mapscene').filter(   rethinkdb.row('uuid').eq(data.uuid)   ).
						delete().
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
							console.log(cursor);
							socket.emit('mapscene',{action:'message',message:'delete objectid:'+data.uuid});
		    			});
				}

			}

			if(data['action'] == 'build'){
				var file = __dirname + "/public/" + 'post-app.json';

				fs.writeFile(file, data['object'], function (err) {//write file and data
		         if( err ){
		              console.log( err );
		         }
				 console.log('file finish write');
				 file = null;
		       });

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
