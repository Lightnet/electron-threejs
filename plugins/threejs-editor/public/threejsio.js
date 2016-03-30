var socketio = io();

socketio.on('connect',()=>{
	console.log('connect.');
	initEditor();
});
