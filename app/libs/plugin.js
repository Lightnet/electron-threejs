"use strict";
var Globals;
(function (Globals) {
    Globals.m_Name = "Plugin";
})(Globals = exports.Globals || (exports.Globals = {}));
var Plugin = (function () {
    function Plugin() {
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
    }
    Plugin.prototype.setConfig = function (_config) {
        this.config = _config;
    };
    Plugin.prototype.getConfig = function () {
        return this.config;
    };
    Plugin.prototype.setDatabase = function (_data) {
        if (_data === void 0) { _data = {}; }
        if (_data.type != null) {
            if (_data.database != null) {
                this.databasetype = _data.type;
                this.database[_data.type] = _data.database;
            }
        }
    };
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
    Plugin.prototype.addModule = function (_module) {
        this.modulelist.push(_module);
        if (typeof _module.setroute === 'function') {
            this.routeList.push(_module);
        }
        if (typeof _module.socketio_connect === "function") {
            this.socketconnectList.push(_module);
        }
        if (typeof _module.socketio_disconnect === "function") {
            this.socketdisconnectList.push(_module);
        }
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
    Plugin.prototype.removeModule = function (_module) {
        for (var i = 0; i < this.modulelist.length; i++) {
            if (this.modulelist[i] == _module) {
            }
        }
    };
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
    Plugin.prototype.set_engineio = function (obj) {
        this.engineio = obj;
    };
    Plugin.prototype.get_engineio = function () {
        return this.engineio;
    };
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
    Plugin.prototype.set_socketio = function (obj) {
        this.socketio = obj;
    };
    Plugin.prototype.get_socketio = function () {
        return this.socketio;
    };
    Plugin.prototype.Call_SocketIO_Connection = function (_io, _socket) {
        for (var i = 0; i < this.socketconnectList.length; i++) {
            this.socketconnectList[i].socketio_connect(_io, _socket);
        }
    };
    Plugin.prototype.Call_SocketIO_Disconect = function (_io, _socket) {
        for (var i = 0; i < this.socketdisconnectList.length; i++) {
            this.socketdisconnectList[i].socketio_disconnect(_io, _socket);
        }
    };
    Plugin.prototype.SetRoutes = function (_routes, _app) {
        for (var i = 0; i < this.routeList.length; i++) {
            this.routeList[i].setroute(_routes, _app);
        }
    };
    return Plugin;
}());
exports = (module).exports = new Plugin();
