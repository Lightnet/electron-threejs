var socketio = io();

projectid = "threejseditor";

var rename = '';
var assets = [];
var assets_select;

var contents = [];
var content_select;

var selectnodeprops;
var props = [];
//var props_select;

//get file ext
function getext(filename){
	return filename.substr(filename.lastIndexOf('.'));
}

socketio.on('connect',()=>{
	if(threejsapi == null){
		console.log('connect.');
		initEditor();
		initDropzone();
		threejsapi = new ThreejsAPI.Game({onload:false});
		RefreshAssets();
		RefreshContent();
		NodePropsRefresh();
	}
});

socketio.on('refreshassets',(data)=>{
	//console.log('test refresh');
	//if(threejsapi == null){
		console.log('test refresh');
		RefreshAssets();
	//}
});

socketio.on('assets',(data)=>{
	if(data['action'] != null){
		if(data.action == 'clear'){
			//if(assets != null){
				assets = [];
			//}
			removenodelist(w2ui.sidebar_assets, w2ui.sidebar_assets.nodes[0].nodes);
		}
		if(data.action == 'add'){
			//if(assets !=null){
				assets.push(data);;
			//}
			var icon_i = 'fa fa-file';

			if(getext(data.name) == '.jpg'){
				icon_i = 'fa fa-file-image-o';
			}
			if(getext(data.name) == '.jpeg'){
				icon_i = 'fa fa-file-image-o';
			}
			if(getext(data.name) == '.png'){
				icon_i = 'fa fa-file-image-o';
			}
			if(getext(data.name) == '.gif'){
				icon_i = 'fa fa-file-image-o';
			}
			if(getext(data.name) == '.txt'){
				icon_i = 'fa fa-file-text-o';
			}
			if(getext(data.name) == '.js'){
				icon_i = 'fa fa-file-text-o';
			}
			if(getext(data.name) == '.json'){
				icon_i = 'fa fa-file-text-o';
			}
			if(getext(data.name) == '.js'){
				icon_i = 'fa fa-file-text-o';
			}
			if(getext(data.name) == '.ts'){
				icon_i = 'fa fa-file-text-o';
			}
			if(getext(data.name) == '.fbx'){
				icon_i = 'fa fa-cube';
			}
			if(getext(data.name) == '.dae'){
				icon_i = 'fa fa-cube';
			}
			if(getext(data.name) == '.obj'){
				icon_i = 'fa fa-cube';
			}
			if(getext(data.name) == '.mtl'){
				icon_i = 'fa fa-cube';
			}
			if(getext(data.name) == '.md'){
				icon_i = 'fa fa-cube';
			}
			if(getext(data.name) == '.html'){
				icon_i = 'fa fa-html5';
			}

			w2ui.sidebar_assets.insert('Assets', null, [
	   			{ id: data.id, text: data.name, icon: icon_i }
   			]);
		}
	}
	//console.log('connect.');
	//initEditor();
});

function RefreshAssets(){
	console.log('refresh assets socket.io');
	//if(socketio !=null){
		//console.log('assets???');
		//console.log(socketio);
		socketio.emit('getassets','threejseditor');
	//}
}

function RenameAssets(){
	console.log('RenameAssets');
	//if(assets != null){
	console.log(assets);
		for(var i = 0; i < assets.length;i++){
			console.log(assets[i]);
			console.log(assets_select);
			if(assets[i].id  == assets_select){
				//console.log(assets_select + ":"+assets[i]);
				//console.log(assets[i]);
				socketio.emit('assets',{action:"rename",projectid:'threejseditor',id:assets[i].id,name:rename});
			}
		}
	//}
}

function DeleteAssets(){
	console.log('DeleteAssets');
	socketio.emit('assets',{action:"delete",projectid:projectid,id:assets_select});
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
	removenodelist(w2ui.sidebar_content, w2ui.sidebar_content.nodes[0].nodes);
	//display top layer is scene & camera
	for(var i = 0; i < threejsapi.scenenodes.length; i++){
		if(threejsapi.scenenodes[i].type == "PerspectiveCamera"){
			w2ui.sidebar_content.insert('ContentNode', null, [
				{ id: threejsapi.scenenodes[i].uuid, text: threejsapi.scenenodes[i].name, icon: 'fa fa-cube' },
			]);
			listThreejsObjectScene(threejsapi.scenenodes[i].children);
		}

		if(threejsapi.scenenodes[i].type == "Scene"){
			w2ui.sidebar_content.insert('ContentNode', null, [
				{ id: threejsapi.scenenodes[i].uuid, text: threejsapi.scenenodes[i].name, icon: 'fa fa-cube' },
			]);
			listThreejsObjectScene(threejsapi.scenenodes[i].children);
		}
	}
}

function listThreejsObjectScene(nodes){
	if(nodes.length > 0){
		for(var i = 0; i < nodes.length; i++){
			//console.log(nodes[i].name);
			var bfound = false;
			for(var n = 0; n < threejsapi.scenenodes.length;n++){
				if(nodes[i].uuid == threejsapi.scenenodes[n].uuid){
					//console.log(nodes[i].uuid);
					//console.log(threejsapi.scenenodes[n].uuid);
					bfound = true;
					break;
				}
			}

			if(bfound == false){
				bfound = null;
			}

			if(bfound == true){
				bfound = null;
				w2ui.sidebar_content.insert(nodes[i].parent.uuid, null, [
					{ id: nodes[i].uuid, text: nodes[i].name, icon: 'fa fa-cube' },
				]);
				w2ui.sidebar_content.expand(nodes[i].parent.uuid);

				if(nodes[i].children.length > 0){
					listThreejsObjectScene(nodes[i].children);
				}
			}
		}
	}
}

function NodePropsRefresh(){
	//http://stackoverflow.com/questions/28819815/updating-a-variable-when-input-changes-in-jquery
	removenodelist(w2ui.sidebar_props, w2ui.sidebar_props.nodes[0].nodes);
	if(selectnodeprops !=null){
		//http://stackoverflow.com/questions/4602141/variable-name-as-a-string-in-javascript
		//http://jsfiddle.net/karim79/v8FhM/1/

		console.log(selectnodeprops);
		//for(key in selectnodeprops){
			//console.log(key + ': ' + selectnodeprops[key]);
			//console.log(typeof key);
			//console.log(key);
			//console.log(typeof selectnodeprops[key]);
		//}
		/*
			//scene
			selectnodeprops.layers.mask
			selectnodeprops.position
			selectnodeprops.quaternion
			selectnodeprops.rotation
			selectnodeprops.scale
			selectnodeprops.type
			selectnodeprops.userData
			selectnodeprops.visible
			//mesh
			selectnodeprops.castShadow
			selectnodeprops.drawMode
			selectnodeprops.geometry
			selectnodeprops.frustumCulled
			selectnodeprops.material
			selectnodeprops.parent
			// other low
			selectnodeprops.traverse
			selectnodeprops.toJSON
			selectnodeprops.clone
			selectnodeprops.add
		*/


		if(selectnodeprops.id !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:selectnodeprops.uuid, text:'ID:'+ selectnodeprops.uuid
										, icon: 'fa fa-cube' }
			]);
		}

		if(selectnodeprops.visible !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:'obj_visible', text:'boolean: <input id="obj_visible" type="checkbox">'
										, icon: 'fa fa-cube' }
			]);
			setTimeout(()=>{
				document.getElementById("obj_visible").checked = selectnodeprops.visible;
				$('#obj_visible').change(function(e) {
					//console.log( e.target.value);
					//console.log( e.target);
					console.log( document.getElementById("obj_visible").checked);
					selectnodeprops.visible = document.getElementById("obj_visible").checked;
				});
			},50);
		}

		if(selectnodeprops.name !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:'position0', text: 'Name:<input id="obj_name" type="text" value="' + selectnodeprops.name + '" />'
										, icon: 'fa fa-cube' }
			]);
			setTimeout(()=>{
				$('#obj_name').change(function(e) {
					console.log("change?");
					selectnodeprops.name = e.target.value;
				});
			},50);
		}

		if(selectnodeprops.position !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:'obj_position', text: 'x:<input id="obj_position_x" type="text" value="' + selectnodeprops.position.x + '" /><br>'+
										'y:<input id="obj_position_y" type="text" value="' + selectnodeprops.position.y + '"/><br>'+
										'z:<input id="obj_position_z" type="text" value="' + selectnodeprops.position.z + '"/>'
										, icon: 'fa fa-cube' }
			]);
			setTimeout(()=>{
				$('#obj_position_x').change(function(e) {
					console.log("change?");
					selectnodeprops.position.x = e.target.value;
				});
				$('#obj_position_y').change(function(e) {
					console.log("change?");
					selectnodeprops.position.y = e.target.value;
				});
				$('#obj_position_z').change(function(e) {
					console.log("change?");
					selectnodeprops.position.z = e.target.value;
				});
			},50);
		}

		if(selectnodeprops.rotation !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:'obj_rotation', text: 'x:<input id="obj_rotation_x" type="text" value="' + selectnodeprops.rotation.x + '" /><br>'+
										'y:<input id="obj_rotation_y" type="text" value="' + selectnodeprops.rotation.y + '"/><br>'+
										'z:<input id="obj_rotation_z" type="text" value="' + selectnodeprops.rotation.z + '"/>'
										, icon: 'fa fa-cube' }
			]);
			setTimeout(()=>{
				$('#obj_rotation_x').change(function(e) {
					console.log("change?");
					selectnodeprops.rotation.x = e.target.value;
				});
				$('#obj_rotation_y').change(function(e) {
					console.log("change?");
					selectnodeprops.rotation.y = e.target.value;
				});
				$('#obj_rotation_z').change(function(e) {
					console.log("change?");
					selectnodeprops.rotation.z = e.target.value;
				});
			},50);
		}

		if(selectnodeprops.scale !=null){
			w2ui.sidebar_props.insert('NObject', null, [
				{ id:'obj_scale', text: 'x:<input id="obj_scale_x" type="text" value="' + selectnodeprops.scale.x + '" /><br>'+
										'y:<input id="obj_scale_y" type="text" value="' + selectnodeprops.scale.y + '"/><br>'+
										'z:<input id="obj_scale_z" type="text" value="' + selectnodeprops.scale.z + '"/>'
										, icon: 'fa fa-cube' }
			]);
			setTimeout(()=>{
				$('#obj_scale_x').change(function(e) {
					console.log("change?");
					selectnodeprops.scale.x = e.target.value;
				});
				$('#obj_scale_y').change(function(e) {
					console.log("change?");
					selectnodeprops.scale.y = e.target.value;
				});
				$('#obj_scale_z').change(function(e) {
					console.log("change?");
					selectnodeprops.scale.z = e.target.value;
				});
			},50);
		}




	}
	//listThreejsObjectScene(threejsapi.scenenodes[i].children);
}


function NodeSelectObject(args){
	console.log('selected object');
	if(args !=null){
		if(args['object'] !=null){
			selectnodeprops = args['object'];
			NodePropsRefresh();
		}
	}
}

function DeleteContent(){
	console.log('refresh Content');
}

//sidebar node remove list from nodes and childs
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
