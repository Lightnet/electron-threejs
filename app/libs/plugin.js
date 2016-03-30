/*
    Name:
    Link:https://bitbucket.org/Lightnet/
    Created By: Lightnet
    License: Creative Commons Zero [Note there multiple Licenses]
    Please read the readme.txt file for more information.
*/
"use strict";
//declare var modules;
//declare var addModule;
//declare var removeModule;
//declare var getModules;
//declare var addView;
var Globals;
(function (Globals) {
    Globals.m_Name = "Plugin";
})(Globals = exports.Globals || (exports.Globals = {}));
var Plugin = (function () {
    //console.log("init manage");
    function Plugin() {
        //public static MyInstance:any;
        this.self = this;
        this.databasetype = "";
        this.database = [];
        this.modulelist = [];
        this.routeList = [];
        this.socketconnectList = [];
        this.socketdisconnectList = [];
        this.list_initpost = [];
        this.appBeforeSession = [];
        this.appSession = [];
        this.appAfterSession = [];
        if (Globals.m_Instance == null) {
            Globals.m_Instance = this.self;
            this.id = Math.random();
            this.eio_connectlist = [];
            this.eio_messagelist = [];
            this.eio_closelist = [];
        }
        else if (Globals.m_Instance != this.self) {
            this.self = Globals.m_Instance;
        }
        //console.log("init manage plugin:"+this.id);
        //console.log(module);
        //console.log(Globals);
    }
    //===============================================
    // Config
    //===============================================
    Plugin.prototype.setConfig = function (_config) {
        this.config = _config;
    };
    Plugin.prototype.getConfig = function () {
        return this.config;
    };
    //===============================================
    // Database
    //===============================================
    //type, database class
    Plugin.prototype.setDatabase = function (_data) {
        if (_data === void 0) { _data = {}; }
        if (_data.type != null) {
            if (_data.database != null) {
                this.databasetype = _data.type;
                this.database[_data.type] = _data.database;
            }
        }
    };
    //get current database type
    Plugin.prototype.getDatabase = function (_type) {
        if (_type === void 0) { _type = ""; }
        if (_type != null) {
            if (this.database[_type] != null) {
                return this.database[_type];
            }
            else {
                throw new Error('Database type not setup!');
            }
        }
    };
    //add plugin
    Plugin.prototype.addModule = function (_module) {
        //console.log("Added Module...");
        this.modulelist.push(_module);
        //route page url
        if (typeof _module.setroute === 'function') {
            this.routeList.push(_module);
        }
        //socket.io
        if (typeof _module.socketio_connect === "function") {
            this.socketconnectList.push(_module);
        }
        if (typeof _module.socketio_disconnect === "function") {
            this.socketdisconnectList.push(_module);
        }
        //engine.io
        if (typeof _module.engineio_connect === "function") {
            this.eio_connectlist.push(_module);
        }
        if (typeof _module.engineio_message === "function") {
            this.eio_messagelist.push(_module);
        }
        if (typeof _module.engineio_close === "function") {
            this.eio_closelist.push(_module);
        }
        if (typeof _module.initpost === "function") {
            this.list_initpost.push(_module);
        }
        //session
        if (typeof _module.setBeforeSession === "function") {
            this.appBeforeSession.push(_module);
        }
        if (typeof _module.setSession === "function") {
            this.appSession.push(_module);
        }
        if (typeof _module.setAfterSession === "function") {
            this.appAfterSession.push(_module);
        }
    };
    //add plugin
    Plugin.prototype.removeModule = function (_module) {
        for (var i = 0; i < this.modulelist.length; i++) {
            if (this.modulelist[i] == _module) {
            }
        }
    };
    //get list plugin module
    Plugin.prototype.getModuleList = function () {
        return this.modulelist;
    };
    Plugin.prototype.InitPost = function () {
        for (var i = 0; i < this.list_initpost.length; i++) {
            this.list_initpost[i].initpost();
        }
    };
    Plugin.prototype.AssignBeforeSession = function (_app, _session, _config) {
        for (var i = 0; i < this.appBeforeSession.length; i++) {
            this.appBeforeSession[i].setBeforeSession(_app, _session, _config);
        }
    };
    Plugin.prototype.AssignSession = function (_app, _session, _config) {
        for (var i = 0; i < this.appSession.length; i++) {
            this.appSession[i].setSession(_app, _session, _config);
        }
    };
    Plugin.prototype.AssignAfterSession = function (_app, _session, _config) {
        for (var i = 0; i < this.appAfterSession.length; i++) {
            this.appAfterSession[i].setAfterSession(_app, _session, _config);
        }
    };
    //===============================================
    // Engine.IO
    //===============================================
    Plugin.prototype.set_engineio = function (obj) {
        this.engineio = obj;
    };
    Plugin.prototype.get_engineio = function () {
        return this.engineio;
    };
    //engine.io call
    Plugin.prototype.call_engineio_connect = function (eio, socket) {
        for (var i = 0; i < this.eio_connectlist.length; i++) {
            this.eio_connectlist[i].engineio_connect(eio, socket);
        }
    };
    Plugin.prototype.call_engineio_message = function (data, socket) {
        for (var i = 0; i < this.eio_messagelist.length; i++) {
            this.eio_messagelist[i].engineio_message(data, socket);
        }
    };
    Plugin.prototype.call_engineio_close = function (socket) {
        for (var i = 0; i < this.eio_closelist.length; i++) {
            this.eio_closelist[i].engineio_close(socket);
        }
    };
    //===============================================
    // Socket.IO
    //===============================================
    Plugin.prototype.set_socketio = function (obj) {
        this.socketio = obj;
    };
    Plugin.prototype.get_socketio = function () {
        return this.socketio;
    };
    //set connection
    Plugin.prototype.Call_SocketIO_Connection = function (_io, _socket) {
        for (var i = 0; i < this.socketconnectList.length; i++) {
            this.socketconnectList[i].socketio_connect(_io, _socket);
        }
    };
    //set disconnection
    Plugin.prototype.Call_SocketIO_Disconect = function (_io, _socket) {
        for (var i = 0; i < this.socketdisconnectList.length; i++) {
            this.socketdisconnectList[i].socketio_disconnect(_io, _socket);
        }
    };
    //set route
    Plugin.prototype.SetRoutes = function (_routes, _app) {
        //this.routes = _routes;
        for (var i = 0; i < this.routeList.length; i++) {
            //console.log("route(s)");
            this.routeList[i].setroute(_routes, _app);
        }
    };
    return Plugin;
}());
exports = (module).exports = new Plugin();
