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
// A simple chat server using Socket.IO, Express, and Async.
//

declare var r:any;
declare var connection:any;
declare var OBJIONetworkType:any;
declare var bConfigPlayCanvas:any;
declare var config:any;

//console.log('\x1b[36m', 'server' ,'\x1b[0m');

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
//busboy = require('busboy');
//var busboy = require('connect-busboy');
var routes = require('./app/routes/index');
var users = require('./app/routes/users');
var multer  = require('multer');


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
console.log('\x1b[36m', "err: ",'test========================','\x1b[0m');
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
					console.error("[FAIL]Module Name:"+scriptconfig.name);
					console.error('\x1b[36m', "err: "+err,'\x1b[0m');
				}
			}
		} catch (err) {
			//console.log("Fail to load! | Doesn't exist!");
			console.error("[FAIL]Module Name:" + modelFile);
			console.error('\x1b[36m', "err: "+err,'\x1b[0m');
		}
	});
}else{
	console.log("[ = disable modules = ]");
}
//
// ## SimpleServer `SimpleServer(obj)`
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
//router.use(multer({ dest: './uploads/'}));
//router.use(busboy());
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
	console.log("Threejs server listening at", addr.address + ":" + addr.port);
	//SetTime();
});

function close(){
	server.close(function () { console.log('Server closed!'); });
	//require('./stop.js');
}
exports.close = close;
