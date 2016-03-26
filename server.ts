/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

/// <reference path="./DefinitelyTyped/node/node.d.ts" />
/// <reference path="./app/libs/socketio_handle.ts" />
/// <reference path="./app/libs/engineio_handle.ts" />
/// <reference path="./app/libs/plugin.ts" />
//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

declare var r:any;
declare var connection:any;
declare var OBJIONetworkType:any;
declare var bConfigPlayCanvas:any;
declare var config:any;

var plugin = require('./app/libs/plugin.js');
config = require(__dirname + "/app/config.js");
plugin.setConfig(config);
console.log("MODE:"+config.mode);

var methodOverride = require('method-override');
var compression = require('compression');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _http = require('http');
var path = require('path');
var fs = require('fs');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var engine = require('engine.io');
var engineio = new engine.Server({'transports': ['websocket', 'polling']});

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

//load initalizers
//console.log("loading Sync initalizers:");
var init_files = fs.readdirSync(__dirname + "/app/initalizers");
init_files.forEach(function(initFile){
	if(path.extname(initFile) == '.js'){//check if javascript ext. file
		console.log('loading initalizer: ' + initFile);
		require(__dirname + "/app/initalizers/" + initFile);
	}
});
//load models
//console.log("loading Sync models:");
var model_files = fs.readdirSync(__dirname + "/app/models");
model_files.forEach(function(modelFile){
	if(path.extname(modelFile) == '.js'){//check if javascript ext. file
		console.log('loading model: ' + modelFile);
		require(__dirname + "/app/models/" + modelFile);
	}
});
//load plugin module
if (config.benablemodules) {
	console.log("[ = enable modules = ]");
	var model_files = fs.readdirSync(__dirname + "/plugins/");
	model_files.forEach(function(modelFile){
		var modulepath = __dirname + "/plugins/"+modelFile+"/";
		var modulepathname = modulepath+"index.json";
		try  {
			//load the json file for config
			var scriptconfig = require(modulepath);
			if(scriptconfig.bable == false){
				console.log("[Disable]Module Name:"+scriptconfig.name);
			}else{
				try  {
					//console.log(scriptmodule);
					//console.log(modulepath + scriptmodule.script);
					//load json from file name script
					var scriptmodule =  require(modulepath + scriptconfig.script)
					//check if the function exist to set the url page name link
					//add module
					plugin.addModule(scriptmodule);
					console.log("[PASS]Module Name:"+scriptconfig.name);
				} catch (err) {
					console.log("[FAIL]Module Name:"+scriptconfig.name);
					console.log("err:"+err);
				}
			}
		} catch (err) {
			//console.log("Fail to load! | Doesn't exist!");
			console.log("[FAIL]Module Name:" + modelFile);
			console.log("err:"+err);
		}
	});
}else{
	console.log("[ = disable modules = ]");
}
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = _http.createServer(router);
engineio.attach(server);
var io = socketio.listen(server);

//router.use(function(req, res, next){
    //res.header("Content-Security-Policy", "default-src 'self';script-src 'self';object-src 'none';img-src 'self';media-src 'self';frame-src 'none';font-src 'self' data:;connect-src 'self';style-src 'self'");
    //next();
//});

//===============================================
// express config start
//===============================================

router.use(express.static(path.resolve(__dirname, 'public')));
router.set('view engine', 'ejs'); // set up ejs for templating
router.set('views',path.join(__dirname,'/app/views'));
router.use(compression());
// parse application/json
router.use(bodyParser.json());
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended:true})); // get information from html forms
// parse application/vnd.api+json as json
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));
router.use(cookieParser()); // required before session
router.use(methodOverride());

//===============================================
// express config start
//===============================================

//load file to write url file js
var eio_contents = fs.readFileSync(__dirname + '/node_modules/engine.io-client/engine.io.js').toString();
router.get('/engine.io.js', function(req, res) {
	//res.setHeader("Access-Control-Allow-Origin", "*");
	res.send(eio_contents);
});
//test index page default
//router.get('/', function(req, res){
    //res.render("index",{});
//});

// route, router
plugin.SetRoutes(routes,router);
router.use('/', routes);

// ==============================================
// socket.io
// ==============================================

require('./app/libs/socketio_handle.js')(io);
plugin.set_socketio(io);
// ==============================================
// engine.io
// ==============================================

require('./app/libs/engineio_handle.js')(engineio);
plugin.set_engineio(engineio);
/*
var messages = [];
var sockets = [];
io.on('connection', function (socket) {
	console.log("socket.io user connected!");
	console.log(socket.id);
    messages.forEach(function (data) {
		socket.emit('message', data);
    });

    sockets.push(socket);
	//send back the ping message for transport time
	socket.on('Latency', function () {
		socket.emit('Latency');
	});

    socket.on('disconnect', function () {
		sockets.splice(sockets.indexOf(socket), 1);
		//updateRoster();
		console.log("socket.io user disconnect!");
		rethinkdb_socketio_remove(socket);
    });
    socket.on('message', function (msg) {
		var text = String(msg || '');
		if (!text)
			return;
		//socket.get('name', function (err, name) {
			//var data = {
				//name: name,
				//text: text
			//};
			//broadcast('message', data);
			//messages.push(data);
		//});
	});

    socket.on('identify', function (name) {
		//console.log('name:'+name);
		var name:any = String(name || 'Anonymous');
		//socket.set('name', String(name || 'Anonymous'), function (err) {
			//updateRoster();

			//console.log(socket.id);
			//socket.name = String(name || 'Anonymous');
		//});

		r.table('socketio').insert([
			{ 	id: socket.id,
				name: name,
				idname:socket.id
			}
		]).run(connection, function(err, result) {
			if (err){
				//console.log(err);
				return;
			}
			socket.emit('identify',name);
			//console.log("socket.io add id!");
			//console.log(JSON.stringify(result, null, 2));
		})
	});
});

//delete id user name
function rethinkdb_socketio_remove(socket){
	r.table('socketio').
    filter(r.row('id').eq(socket.id)).
    delete().
    run(connection, function(err, result) {
        if (err){
			console.log(err);
			//throw err;
		}
        //console.log(JSON.stringify(result, null, 2));
    });
}

function updateRoster() {
	console.log('updateRoster');
	async.map(
		sockets,
		function (socket, callback) {
			//socket.get('name', callback);
			//console.log("sockets?>> map");
			//callback(socket.name);
			r.table('socketio').filter(r.row('id').eq(socket.id)).
		    run(connection, function(err, cursor) {
				//console.log("get socket id ?");
		        if (err)console.log(err);
		        cursor.toArray(function(err, result) {
		            if (err){
						console.log(err);
						return;
					}
					//console.log("get socket.io name??");

					var user = JSON.stringify(result, null, 2);
		            //console.log(user[0]['id']);
					//console.log(user);
					//console.log(result[0]['name']);
					if(result.length > 0){
						//console.log('name:' + result[0]['name']);
						callback(result[0]['name']);
					}else{
						//console.log(JSON.stringify(result, null, 2));
						callback(null);
					}
		        });
		    });
		},
		function (err, names) {
			broadcast('roster', names);
		}
	);
}

function broadcast(event, data) {
	sockets.forEach(function (socket) {
		socket.emit(event, data);
	});
}
*/
//=========================================================
// engine.io
//=========================================================

//console.log(engineio);
/*
engineio.on('connection', function (socket) {
	console.log("engine.io user connected.");
	console.log(socket.id);
    //console.log(engineio);
    //console.log(engineio.clients);
    //for(eid in engineio.clients) {
        //console.log(engineio.clients[eid]);
        //engineio.clients[eid].send('test');
        //console.log(variable);
    //}
    //console.log(socket);

    //socket.send('ping');
    //socket.send("{test:'test'}"); //send out as string
    socket.on('message', function(data){
		if(data != 'Latency'){
			console.log(data);
		}
		if(data == 'Latency'){
            socket.send('Latency');
        }
    });
    socket.on('close', function(){
        console.log("engine.io user close.");
    });
    //socket.send('utf 8 string');
    //socket.send(new Buffer([0, 1, 2, 3, 4, 5])); // binary data
    //console.log(new Buffer([0, 1, 2, 3, 4, 5]));
    //socket.send(new test()); // binary data
});

//create send clients
function engineiobroadcast(data){
    for(var eid in engineio.clients) {
        //console.log(engineio.clients[eid]);
        engineio.clients[eid].send(data);
    }
}
*/
//=========================================================
// start listen express server
//=========================================================
function SetTime(){
	console.log(new Date().getTime());
	setTimeout(SetTime, 3000);
}

server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function(){
	var addr = server.address();
	//Init start up after the web server is up.
	plugin.InitPost();
	console.log("PlayCanvas server listening at", addr.address + ":" + addr.port);
	//SetTime();
});

function close(){
	server.close(function () { console.log('Server closed!'); });
	//require('./stop.js');
}
exports.close = close;
