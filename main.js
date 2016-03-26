/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

'use strict';

var settings = require('./settings.json');
console.log(settings['autostartdatabase']);

function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";
    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
} // ()

//run_cmd( "ls", ["-l"], function(text) { console.log (text) });
if(settings['autostartdatabase'] == true){
	//run_cmd( 'rethinkdb', [], function(text) { console.log (text) });
	run_cmd( settings['executedatabase'], [], function(text) { console.log (text) });
}


const electron = require('electron');
// Module to control application life.
const app = electron.app;
const ipcMain = electron.ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
var Menu = require('menu');
var Tray = require('tray');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var windows = [];
windows['database']={object:null,url:'http://localhost:8080/',options:{width: 800, height: 600, webPreferences:{nodeIntegration:false}} };
windows['server']={object:null,url:'file://' + __dirname + '/playcanvas-server.html',options:{width: 800, height: 600} };
windows['client']={object:null,url:'http://localhost/'+'client.html',options:{width: 800, height: 600, webPreferences:{nodeIntegration:false}} };
windows['game']={object:null,url:'http://localhost/',options:{width: 800, height: 600, webPreferences:{nodeIntegration:false}} };
windows['settings']={object:null,url:'file://' + __dirname + '/settings.html',options:{width: 800, height: 600, webPreferences:{nodeIntegration:false}} };
windows['status']={object:null,url:'http://localhost/',options:{width: 800, height: 600, webPreferences:{nodeIntegration:false}} };

var appIcon = null;
//server express
var serverclose;
setTimeout(function(){
serverclose = require('./server.js').close;
},1500);

function buildwindow(url,options){
	var _Window = new BrowserWindow(options);
	_Window.loadURL(url);
	var webContents = _Window.webContents;
	webContents.openDevTools();
	webContents.on("did-finish-load", function(){});
	return _Window;
}

function windowcheck(id){
	if(windows[id]['object'] != null){
		try{
			windows[id]['object'].show();
		}catch(e){
			windows[id]['object'] = null;
			windows[id]['object'] = buildwindow(windows[id]['url'],windows[id]['options']);
		}
	}else{
		windows[id]['object'] = buildwindow(windows[id]['url'],windows[id]['options']);
	}
}

function displaywindowid(windowid){
	if(windowid == 'game'){
		windowcheck(windowid);
	}
	if(windowid == 'server'){
		windowcheck(windowid);
	}
	if(windowid == 'client'){
		windowcheck(windowid);
	}
	if(windowid == 'database'){
		windowcheck(windowid);
	}
	if(windowid == 'settings'){
		windowcheck(windowid);
	}
}

function createWindow () {
	console.log("createWindow?");
	//create server playcanvas
	//stand alone game
	appIcon = new Tray( __dirname + './public/favicon.ico');

	var contextMenu = Menu.buildFromTemplate([
		//{ label: 'Start Up Window', click: function() {ipcRenderer.send('start-up', 't' ); console.log('start-up');}},
		{ label: 'Database', click: function() { displaywindowid('database'); console.log('item database'); }},
		{ label: 'Server', click: function() {displaywindowid('server');  console.log('item server'); }},
		{ label: 'Client', click: function() {displaywindowid('client'); console.log('item client'); }},
		{ label: 'Game', click: function() { displaywindowid('game'); console.log('item game'); }},
		{ label: 'Settings',  click: function() { displaywindowid('settings'); console.log('item settings');}}
	]);

	appIcon.setToolTip('This is my application.');
	appIcon.setContextMenu(contextMenu);
	appIcon.on('clicked',function(event){
		//console.log(event);
		//console.log('click');
		if(mainWindow !=null){
			console.log(mainWindow);
			if(mainWindow.isVisible()){
				mainWindow.hide();
			}else{
				mainWindow.show();
			}
		}
	});

	ipcMain.on('window-display', function(event, windowid) {
  		console.log('windowid:'+windowid);
		displaywindowid(windowid);
	});
	setTimeout(function(){
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 800, height: 600});
	// and load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');
	//mainWindow.loadURL('http://127.0.0.1:3000/');
	var webContents = mainWindow.webContents;
	webContents.on("did-finish-load", function() {
		//console.log("Write PDF successfully.");
		//console.log(mainWindow);
	});
	//console.log("hello world");
	// Open the DevTools.
	mainWindow.webContents.openDevTools();
	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
},2000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);
//TASKKILL /F /IM rethinkdb.exe /IM rethinkdb.exe
// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		console.log("close app.");
		//close express
		serverclose();
		//stop rethinkdb
		if(settings['autostartdatabase'] == true){
			run_cmd( 'TASKKILL', [ '/F','/IM',settings['executedatabase']+'.exe'], function(text) { console.log (text) });
		}
		//process.exit(0);
		app.quit();
	}
});

app.on('activate', function () {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	console.log("activate?");
	if (mainWindow === null) {
		createWindow();
	}
});
//},1000);
