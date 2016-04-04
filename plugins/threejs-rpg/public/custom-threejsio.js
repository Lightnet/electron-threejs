var socketio = io();

socketio.on('connect',()=>{
	if(threejsapi == null){
		console.log('connect.');
		initEditor();
		initDropzone();
		threejsapi = new ThreejsAPI.Game({onload:false});
		RefreshAssets();
	}
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

function DeleteAssets(){
	console.log('DeleteAssets');
	//if(socketio !=null){
		//console.log('assets???');
		//socketio.emit('getassets','threejseditor');
	//}
}

function RefreshScene(){
	console.log('refresh scene');
	if(socketio !=null){
		console.log('scene???');
		//socketio.emit('getscene','threejseditor');
	}
}

function RefreshScript(){
	console.log('refresh script');
	if(socketio !=null){
		console.log('scene???');
		//socketio.emit('getscene','threejseditor');
	}
}

function RefreshContent(){
	console.log('refresh Content');
	//w2ui.sidebar_content
	removenodelist(w2ui.sidebar_content, w2ui.sidebar_content.nodes[0].nodes);
	//if(socketio !=null){
		//console.log('scene???');
		//socketio.emit('getscene','threejseditor');
	//}
}

function DeleteContent(){
	console.log('refresh Content');
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
