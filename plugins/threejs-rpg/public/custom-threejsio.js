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




		//ReactDOM.render(
  			//React.createElement('h1', null, 'Hello, world!'),
  			//document.getElementById('objectprops')
		//);

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


		//w2ui.sidebar_props.add([
			 //{ id: 'scripts', text: 'scripts', icon: 'w2ui-icon-check' ,expanded: true, group: true}
		 //]);
		 //SidebarPropsVar({parent:'scripts',type:'input',obj:selectnodeprops,param:'position.z'});
		/*
		SidebarPropsVar({parent:'NObject',type:'label',obj:selectnodeprops,param:'uuid'});

		SidebarBooleanProps('NObject',selectnodeprops,'visible');

		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'name'});


		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'position.x'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'position.y'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'position.z'});

		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'rotation.x'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'rotation.y'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'rotation.z'});


		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'scale.x'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'scale.y'});
		SidebarPropsVar({parent:'NObject',type:'input',obj:selectnodeprops,param:'scale.z'});
		*/
	}
	//listThreejsObjectScene(threejsapi.scenenodes[i].children);
}

//work boolean
function SidebarBooleanProps(id,obj,variable){
	if(obj[variable] !=null){
		w2ui.sidebar_props.insert(id, null, [
			{ id:'obj_'+obj.id+'_'+variable, text: variable + ':<input id="' + ('obj_'+obj.id+'_'+variable)  +  '" type="checkbox" />', icon: 'fa fa-cube' }
		]);
		setTimeout(()=>{
				document.getElementById(('obj_'+obj.id+'_'+variable)).checked = selectnodeprops.visible;
			$( ('#'+'obj_'+obj.id+'_'+variable) ).change(function(e) {
				console.log("change?");
				selectnodeprops.visible = document.getElementById(('obj_'+obj.id+'_'+variable)).checked;
			});
		},50);
	}
}

var _ReactBoolean = React.createClass({
	propType:{
		value: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
    		value: _.get(this.props.obj, this.props.params) //set variable
  		}
	},
	handleChange: function(event) {
  		this.setState({
    		value: event.target.checked
  		});
		//console.log(event.target.value);
		//console.log(event.target.checked);
		_.set(this.props.obj, this.props.params, event.target.checked);
		//RefreshContent();//update real time when keyboard is press
	},
	render: function() {
		return React.createElement("input", {
												type: "checkbox",
												onChange:this.handleChange,
												checked :this.state.value
											});
	}
});
//class input reactjs
var _ReactInput = React.createClass({
	propType:{
		value: React.PropTypes.object.isRequired
	},
	getInitialState: function() {
		return {
    		value: _.get(this.props.obj, this.props.params) //set variable
  		}
	},
	onNameInput:function(syntheticEvent) {
		//console.log(syntheticEvent);
		//console.log(this.props);
		//console.log(syntheticEvent.target.value);
		//console.log(syntheticEvent.type);
		_.set(this.props.obj, this.props.params, syntheticEvent.target.value);
		//console.log(this.props.obj);
	},
	handleChange: function(event) {
  		this.setState({
    		value: event.target.value
  		});
		RefreshContent();//update real time when keyboard is press
	},
	render: function() {
		return React.createElement("input", {
												type: "text",
												onInput:this.onNameInput,
												onChange:this.handleChange,
												value:this.state.value
											});
	}
});
//set input params from object data string
function _reactSetInput(args){
	if(args !=null){
		ReactDOM.render(React.createElement(_ReactInput,{obj:args['obj'],params:args['param']}),
		document.getElementById(
			('obj_'+args['obj']['id']+'_'+args['param'])
		));
	}
}

//http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string
function SidebarPropsVar(args){
	if(args !=null){
		if((args['type'] == 'label')&&(args['param'] != null)){//label
			w2ui.sidebar_props.insert(args['parent'], null, [
				{ id:'obj_'+args['obj']['id']+'_'+args['param'], text: args['param']+':'+ args['obj'][args['param']] , icon: 'fa fa-cube' }
			]);
		}
		if((args['type'] == 'input')&&(args['param'] != null)){//input text
			//console.log(  ('obj_'+args['obj']['id']+'_'+args['param'])  );
			w2ui.sidebar_props.insert(args['parent'], null, [
				{ id:'obj_'+args['obj']['id']+'_'+args['param'],
				  icon: 'fa fa-cube',
				  text: args['param'] + ':<div id="' + ('obj_'+args['obj']['id']+'_'+args['param']) + '" />' }
				  //text: args['param'] + ':<input id="' + ('obj_'+'_'+args['param']) + '" type="text" value="' + '' + '" />' }
			]);
			//if(args['param'] != 'name'){
				setTimeout(()=>{
					//console.log('set: ' + args['param']);
					_reactSetInput(args);
				},200);
			//}
		}
	}
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

function SideBarAddNode(obj,_id,childid,name){
	obj.insert(_id, null, [
		{ id: childid, text: name, icon: 'fa fa-cube' },
	]);
	//setTimeout(()=>{
		//obj.expand(_id);
	//},50);
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
