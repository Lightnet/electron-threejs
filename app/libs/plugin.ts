/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

//declare var modules;
//declare var addModule;
//declare var removeModule;
//declare var getModules;
//declare var addView;

export module Globals
{
   export var m_Name : string = "Plugin";
   export var m_Instance : any;
}

class Plugin{
    //public static MyInstance:any;
    self:any = this;
    name:string;
    id:any;
    config:any;
    databasetype:string = "";
    database:any = [];
    socketio:any;
	engineio:any;
    app:any;
    routes:any;
    modulelist:any = [];
    routeList:any = [];

    socketconnectList:any = [];
    socketdisconnectList:any = [];

    eio_connectlist:any [];
    eio_messagelist:any [];
    eio_closelist:any [];

	list_initpost:any = [];

    appBeforeSession:any = [];
    appSession:any = [];
    appAfterSession:any = [];

    //console.log("init manage");
    constructor() {
        if(Globals.m_Instance == null){
            Globals.m_Instance = this.self;
            this.id =  Math.random();
            this.eio_connectlist = [];
            this.eio_messagelist = [];
            this.eio_closelist = [];
        }else if(Globals.m_Instance != this.self ){
            this.self = Globals.m_Instance;
        }
      //console.log("init manage plugin:"+this.id);
      //console.log(module);
      //console.log(Globals);
    }
//===============================================
// Config
//===============================================
    setConfig(_config){
        this.config = _config;
    }
    getConfig(){
        return this.config;
    }
//===============================================
// Database
//===============================================
    //type, database class
    setDatabase(_data:any = {}){
        if(_data.type != null ){
            if(_data.database !=null){
                this.databasetype = _data.type;
                this.database[_data.type] = _data.database;
            }
        }
    }
    //get current database type
    getDatabase(_type:string = ""){
        if(_type != null){
            if(this.database[_type] !=null){
                return this.database[_type];
            }else{
                throw new Error('Database type not setup!');
            }
        }
    }
    //add plugin
    addModule (_module){
        //console.log("Added Module...");
        this.modulelist.push(_module);
        //route page url
        if(typeof _module.setroute === 'function'){
            this.routeList.push(_module);
        }
        //socket.io
        if( typeof _module.socketio_connect === "function"){
			this.socketconnectList.push(_module);
		}
		if( typeof _module.socketio_disconnect === "function"){
			this.socketdisconnectList.push(_module);
		}
        //engine.io
        if( typeof _module.engineio_connect === "function"){
			this.eio_connectlist.push(_module);
		}
        if( typeof _module.engineio_message === "function"){
			this.eio_messagelist.push(_module);
		}
        if( typeof _module.engineio_close === "function"){
			this.eio_closelist.push(_module);
		}

		if( typeof _module.initpost === "function"){
			this.list_initpost.push(_module);
		}

        //session
        if( typeof _module.setBeforeSession === "function"){
			this.appBeforeSession.push(_module);
		}
		if( typeof _module.setSession === "function"){
			this.appSession.push(_module);
		}
		if( typeof _module.setAfterSession === "function"){
			this.appAfterSession.push(_module);
		}
    }
    //add plugin
    removeModule(_module){
        for(var i = 0; i < this.modulelist.length;i++){
            if(this.modulelist[i] == _module){
            }
        }
    }
    //get list plugin module
    getModuleList(){
        return this.modulelist;
    }

	InitPost(){
        for(var i = 0; i < this.list_initpost.length;i++){
            this.list_initpost[i].initpost();
        }
    }

    AssignBeforeSession(_app,_session,_config){
        for(var i = 0; i < this.appBeforeSession.length;i++){
            this.appBeforeSession[i].setBeforeSession(_app,_session,_config);
        }
    }
    AssignSession(_app,_session,_config){
        for(var i = 0; i < this.appSession.length;i++){
            this.appSession[i].setSession(_app,_session,_config);
        }
    }
    AssignAfterSession(_app,_session,_config){
        for(var i = 0; i < this.appAfterSession.length;i++){
            this.appAfterSession[i].setAfterSession(_app,_session,_config);
        }
    }
//===============================================
// Engine.IO
//===============================================
	set_engineio(obj){
		this.engineio = obj;
	}
	get_engineio(){
		return this.engineio;
	}
    //engine.io call
    call_engineio_connect(eio,socket){
        for(var i = 0; i < this.eio_connectlist.length;i++){
            this.eio_connectlist[i].engineio_connect(eio,socket);
        }
    }
    call_engineio_message(data,socket){
        for(var i = 0; i < this.eio_messagelist.length;i++){
            this.eio_messagelist[i].engineio_message(data,socket);
        }
    }
    call_engineio_close(socket){
        for(var i = 0; i < this.eio_closelist.length;i++){
            this.eio_closelist[i].engineio_close(socket);
        }
    }
//===============================================
// Socket.IO
//===============================================
	set_socketio(obj){
		this.socketio = obj;
	}
	get_socketio(){
		return this.socketio;
	}
    //set connection
    Call_SocketIO_Connection(_io, _socket){
        for (var i = 0; i < this.socketconnectList.length; i++ ){
			this.socketconnectList[i].socketio_connect(_io, _socket);
		}
    }
    //set disconnection
    Call_SocketIO_Disconect(_io, _socket){
        for (var i = 0; i < this.socketdisconnectList.length; i++ ){
			this.socketdisconnectList[i].socketio_disconnect(_io, _socket);
        }
    }

    //set route
    SetRoutes(_routes,_app){
        //this.routes = _routes;
        for (var i = 0; i < this.routeList.length; i++ ){
            //console.log("route(s)");
            this.routeList[i].setroute(_routes,_app);
        }
    }
}

exports = (module).exports = new Plugin();
