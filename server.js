console.log('\x1b[36m', 'threejs web server', '\x1b[0m');
var plugin = require('./app/libs/plugin.js');
config = require(__dirname + "/app/config.js");
plugin.setConfig(config);
console.log("MODE:" + config.mode);
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
var engineio = new engine.Server({ 'transports': ['websocket', 'polling'] });
var routes = require('./app/routes/index');
var users = require('./app/routes/users');
var multer = require('multer');
var init_files = fs.readdirSync(__dirname + "/app/initalizers");
init_files.forEach(function (initFile) {
    if (path.extname(initFile) == '.js') {
        console.log('loading initalizer: ' + initFile);
        require(__dirname + "/app/initalizers/" + initFile);
    }
});
var model_files = fs.readdirSync(__dirname + "/app/models");
model_files.forEach(function (modelFile) {
    if (path.extname(modelFile) == '.js') {
        console.log('loading model: ' + modelFile);
        require(__dirname + "/app/models/" + modelFile);
    }
});
if (config.benablemodules) {
    console.log("[ = enable modules = ]");
    var model_files = fs.readdirSync(__dirname + "/plugins/");
    model_files.forEach(function (modelFile) {
        var modulepath = __dirname + "/plugins/" + modelFile + "/";
        var modulepathname = modulepath + "index.json";
        try {
            var scriptconfig = require(modulepath);
            if (scriptconfig.bable == false) {
                console.log("[Disable]Module Name:" + scriptconfig.name);
            }
            else {
                try {
                    var scriptmodule = require(modulepath + scriptconfig.script);
                    plugin.addModule(scriptmodule);
                    console.log("[PASS]Module Name:" + scriptconfig.name);
                }
                catch (err) {
                    console.error("[FAIL]Module Name:" + scriptconfig.name);
                    console.error('\x1b[36m', "err: " + err, '\x1b[0m');
                }
            }
        }
        catch (err) {
            console.error("[FAIL]Module Name:" + modelFile);
            console.error('\x1b[36m', "err: " + err, '\x1b[0m');
        }
    });
}
else {
    console.log("[ = disable modules = ]");
}
var router = express();
var server = _http.createServer(router);
engineio.attach(server);
var io = socketio.listen(server);
router.use(express.static(path.resolve(__dirname, 'public')));
router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, '/app/views'));
router.use(compression());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));
router.use(cookieParser());
router.use(methodOverride());
var eio_contents = fs.readFileSync(__dirname + '/node_modules/engine.io-client/engine.io.js').toString();
router.get('/engine.io.js', function (req, res) {
    res.send(eio_contents);
});
plugin.SetRoutes(routes, router);
router.use('/', routes);
require('./app/libs/socketio_handle.js')(io);
plugin.set_socketio(io);
require('./app/libs/engineio_handle.js')(engineio);
plugin.set_engineio(engineio);
function SetTime() {
    console.log(new Date().getTime());
    setTimeout(SetTime, 3000);
}
server.listen(process.env.PORT || 80, process.env.IP || "0.0.0.0", function () {
    var addr = server.address();
    plugin.InitPost();
    console.log("Threejs server listening at", addr.address + ":" + addr.port);
});
function close() {
    server.close(function () { console.log('Server closed!'); });
}
exports.close = close;
