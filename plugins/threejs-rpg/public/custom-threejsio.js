var socketio = io();

socketio.on('connect',()=>{
	console.log('connect.');
	//initEditor();
});



socketio.on('assets',(data)=>{
	if(data['action'] != null){
		if(data.action == 'clear'){
			removenodelist(w2ui.sidebar_assets, w2ui.sidebar_assets.nodes[0].nodes);
		}

		if(data.action == 'add'){
			w2ui.sidebar_assets.insert('Assets', null, [
	   			{ id: data.id, text: data.name, icon: 'w2ui-icon-check' }
   			]);
		}
	}

	//console.log('connect.');
	//initEditor();
});

function RefreshAssets(){
	console.log('refresh assets');
	if(socketio !=null){
		console.log('assets???');
		socketio.emit('getassets','threejseditor');
	}
}

function RefreshScene(){
	console.log('refresh scene');
	if(socketio !=null){
		console.log('scene???');
		socketio.emit('getscene','threejseditor');
	}
}


function removenodelist(obj,nodes){
	while (true){
		if(0 == nodes.length){
			break;//make sure it has break else it loop forever
		}
		//console.log(nodes[0]);
		//console.log(nodes[i]);
		if(nodes[0].nodes.length > 0){
			removenodelist(obj,nodes[0].nodes);
		}
		obj.remove(nodes[0].id);
	}
}
