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
//===============================================
// Config
//===============================================
module.exports._config = require('./index.json');
//===============================================
// Init Post
//===============================================
//module.exports.initpost = function(){
	//console.log('init post');
	//console.log(connection);//get null since the connect didn't finish setup
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
	'.xml',
	'.txt',
	'.ts',
	'.js',
	'.json'
];

var extcodes = [
	'.fbx',
	'.dae',
	'.obj',
	'.mtl',
	'.md',
	'.html',
	'.xml',
	'.txt',
	'.ts',
	'.js',
	'.json'
];

//check file ext before write to the tmp
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
		//console.log(req.file);
		//console.log(req);
		//console.log(req.query.projectid);
		//console.log(req.body);
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

		var file = __dirname + "/public/assets/" + req.file.originalname;
		var fileproject = "/assets/" + req.file.originalname;

		if((rethinkdb !=null)&&(connection !=null)){
			connection.use('test');
			//console.log(rethinkdb);
			//rethinkdb.table('assets').filter(rethinkdb.row('name').eq(req.file.originalname) & ).
			//check project id and file name
			rethinkdb.table('assets').filter(rethinkdb.row('name').eq(req.file.originalname).and( rethinkdb.row('projectid').eq(req.query.projectid)) ).
    			run(connection, function(err, cursor) {
        			if (err) throw err;
        			cursor.toArray(function(err, result) {
            			if (err){
							console.log("err");
							console.log(err);
						};
						if(result.length == 0){//if file not found in the list add to table
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
						}else{//else update //need to change this.
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

		fs.readFile( req.file.path, function (err, data) {//read tmp file
	        fs.writeFile(file, data, function (err) {//write file and data
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
			rethinkdb.table('assets').filter(rethinkdb.row('projectid').eq(data)). //get the assets files list
    			run(connection, function(err, cursor) {
        			if (err) throw err;
        			cursor.toArray(function(err, result) {
            			if (err){
							console.log("err");
							console.log(err);
						};
						//clear data
						socket.emit('assets',{action:'clear'}); //clear assets editor list
						//send assets list
						for (var i = 0; i < result.length;i++){ //write object socket.io client editor
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
				console.log(data['name']);
				console.log(data['name'].lastIndexOf('../'));
				if(data['name'].lastIndexOf('../') >= 0){ //check if file doesn't change the path
					console.log('error path ../ not aollow');
					return;
				}
				var bmatch = false;

				for(var i in exts) {
					//console.log(exts[i]);
					if( path.extname(data['name'] ) == exts[i] ){//check if ext files to block not added to the list of exts.
						bmatch = true;
						break;
					}
				}

				if(bmatch == false){//exit if ext does not match
					console.log('error ext does not match!');
					return;
				}

				var dirpath = __dirname +"/public/";
				var assetspath = "/assets/" + data['name'] ;
				rethinkdb.table('assets').filter(rethinkdb.row('id').eq(data['id']).and( rethinkdb.row('projectid').eq(data['projectid'])) ). //update projectid and assets id
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
										fs.rename(dirpath + '/assets/' + result[0]['name'], dirpath + "/assets/" + data['name'], function(err) { //update the file name changes
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
					rethinkdb.table('assets').filter(rethinkdb.row('id').eq(data['id'])). //assets look up id
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
									run(connection, function(err, result1) { //this will delete the table id assets
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

	socket.on('code', function(data){
		if(data['action'] !=null){
			console.log('get script code?');
			if(data['action'] == 'get'){
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					console.log(data.name);
					console.log(data.projectid);
					rethinkdb.table('assets').filter(  rethinkdb.row('name').eq(data.name).and( rethinkdb.row('projectid').eq(data.projectid) )   ). //get the assets files list
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									console.log("err");
									console.log(err);
								};
								if(result.length == 1){
									//console.log(__dirname +"/public/"+ result[0]['path']);
									fs.readFile(__dirname +"/public/"+ result[0]['path'], "utf8", function(err, data) {
								        if (err) throw err;
										console.log('loaded fs reading...');
										socket.emit('code',{action:'load',script:data,id:result[0]['id'],name:result[0]['name']});
								    });
								}
								if(result.length == 0){
									console.log('file not found!');
									socket.emit('code',{action:'message',message:'file not found!'});
								}
		        			});
		    			});
				}

			}

			if(data['action'] == 'save'){
				if(data['name'].lastIndexOf('../') >= 0){ //check if file doesn't change the path
					console.log('error path ../ not allow');
					socket.emit('code',{action:'message',message:'error path ../ not allow'});
					return;
				}
				var bmatch = false;

				for(var i in extcodes) {
					//console.log(exts[i]);
					if( path.extname(data['name'] ) == extcodes[i] ){//check if ext files to block not added to the list of exts.
						bmatch = true;
						break;
					}
				}

				if(bmatch == false){//exit if ext does not match
					console.log('error ext does not match!');
					socket.emit('code',{action:'message',message:'error ext does not match!'});
					return;
				}
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					console.log(data.name);
					if(data.name == null){
						socket.emit('code',{action:'message',message:'file error null name!'});
						return;
					}
					console.log(data.projectid);
					rethinkdb.table('assets').filter(  rethinkdb.row('name').eq(data.name).and( rethinkdb.row('projectid').eq(data.projectid) )   ). //get the assets files list
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									console.log("err");
									console.log(err);
								};
								if(result.length == 1){
									fs.writeFile(__dirname +"/public/"+ result[0]['path'], data.content, function(err) {
									    if(err) {
									        return console.log(err);
									    }
									    console.log("The file was saved!");
										socket.emit('code',{action:'save',message:'saved'});
									});
								}
								if(result.length == 0){
									console.log('file not found!');
								}
		        			});
		    			});
				}
			}
		}

	});

	socket.on('script',function(data){
		if(data['action'] !=null){
			if(data['action'] == 'getscripts'){
				console.log('script list???????');
				if((rethinkdb !=null)&&(connection !=null)){
					connection.use('test');
					//console.log(data.name);
					//console.log(data.projectid);
					rethinkdb.table('assets').filter(  rethinkdb.row('name').match('.js$').and( rethinkdb.row('projectid').eq(data.projectid) )   ). //get the assets files list
		    			run(connection, function(err, cursor) {
		        			if (err) throw err;
		        			cursor.toArray(function(err, result) {
		            			if (err){
									console.log("err");
									console.log(err);
								};
								console.log(result.length);
								if(result.length > 0){
									//console.log(__dirname +"/public/"+ result[0]['path']);
									//socket.emit('script',{action:'clear'});
									console.log('//====================================');
									for (var i = 0; i < result.length;i++){//loop to load script file
										console.log('result[i]'+result['name']);
										//console.log(result[i]);
										var assets_data = result[i];
										try{
											var contents = fs.readFileSync(__dirname +"/public/"+ assets_data['path'], "utf8").toString();
											//console.log(contents);
											socket.emit('script',{	action:'add',
																script:contents,
																id:assets_data['id'],
																name:assets_data['name'],
																path:assets_data['path']
															});
										}catch(error){
											console.log('file script not found!');
										}

										/*
										fs.readFile(__dirname +"/public/"+ assets_data['path'], "utf8", function(err, data) {
									        if (err) throw err;
											console.log('loaded fs reading...');
											console.log(assets_data);

											socket.emit('script',{	action:'add',
																	script:data,
																	id:assets_data['id'],
																	name:assets_data['name'],
																	path:assets_data['path']
																});
									    });
										*/
										//socket.emit('script',{	action:'length'});
									}
									socket.emit('script',{action:'finish',message:'scriptslistend'});

								}
								if(result.length == 0){
									console.log('scripts not found!');
									socket.emit('code',{action:'message',message:'files not found!'});
								}
								//console.log(JSON.stringify(result, null, 2));
								//res.end( JSON.stringify( response ) );
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
