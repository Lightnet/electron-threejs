var threejsangular = angular.module('threejsangular', []);
var socketio = io();

projectid = "threejseditor";

var rename = '';
var assets = [];
var assets_select;

var contents = [];
var content_select;

var selectnodeprops;
var props = [];
var editor;
//var props_select;

//get file ext
function getext(filename){
	return filename.substr(filename.lastIndexOf('.'));
}

function initScriptEditor(){
	editor = ace.edit("editor");
	//editor.setTheme("ace/theme/twilight");
	editor.setTheme("ace/theme/chrome");
	editor.session.setMode("ace/mode/javascript");
	//console.log(editor.getValue());

	//var editor = ace.edit("editor");                   // the editor object
	var editorDiv = document.getElementById("layout_layout_panel_main");     // its container
	//var doc = editor.getSession().getDocument();  // a reference to the doc

	function adaptEditor() {
		//var editor = ace.edit("editor");
		var chieght = parseInt(editorDiv.style.height) / editor.renderer.lineHeight;
		var chieght = (Math.floor(chieght) - 5 ) * editor.renderer.lineHeight; //round and multiple
		document.getElementById('editor').style.height = chieght + 'px';
		editor.resize();
		chieght = null;
	}
	window.onresize = function(event) {
	    adaptEditor();
	};
}

socketio.on('connect',()=>{
	if(threejsapi == null){
		console.log('connect.');
		initEditor();
		initDropzone();
		initScriptEditor();

		threejsapi = new ThreejsAPI.Game({onload:false});

		var player = threejsapi.createplayer();
		//console.log(player);

		RefreshAssets();
		initangularnode();
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

//===============================================
//
//===============================================
//<div ng-controller="MainCtrl as vm">
//<nodeinputcomponent params="vm.params"></nodeinputcomponent> //passing variable
//<div>
threejsangular.controller('NodeCtrl', function NodeCtrl($scope) {
  var self= this;
  $scope.init = function(params){
	  self.params = params;
	  console.log(self.params);
  }
});
//===============================================
// Node label
//===============================================
//<nodeinputcomponent params="params='name'"></nodeinputcomponent>
threejsangular.component('nodelabelcomponent', {
	bindings: {
		params:'=' //bind from element attribute
	},
	scope: {
		value:'=' //local var
	},
  	controller:'nodelabelCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>:`+
					`<label>{{$ctrl.value}}<label>` +
				`</div>`;
	}
}).controller('nodelabelCtrl', function nodelabelCtrl($scope) {
	this.$onInit = function () {
		// component initialisation
		this.value = _.get(selectnodeprops, this.params);
		//console.log(this);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});
//===============================================
// Node Input
//===============================================
//<nodeinputcomponent params="params='name'"></nodeinputcomponent>
threejsangular.component('nodeinputcomponent', {
	bindings: {
		params:'=',
		value:'='
	},
  	controller:'nodeinputCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>`+
					`<input type="input" ng-model="value" ng-value="value" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodeinputCtrl', function nodeinputCtrl($scope) {
	function change() {
	  console.log($scope.$ctrl.params);
	  _.set(selectnodeprops, $scope.$ctrl.params, $scope.value);
	  console.log(selectnodeprops);
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		//console.log(this);
		$scope.value = _.get(selectnodeprops, $scope.$ctrl.params);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

function initangularnode(){
	if(document.getElementById('objectprops') == null){
		setTimeout(function () {
			var $target = document.getElementById('objectprops');
			var myEl = angular.element(
				$target
			);
			myEl.empty();
			//console.log(this);
			angular.element($target).injector().invoke(function($compile) {
				var scope = angular.element($target).scope();
				angular.element($target).append($compile(`<div id="nodecontroller" ng-controller="nodecomponentCtrl as vm"><nodecomponent ></nodecomponent><div id="listcomponent"></div></div>`)(scope));
				// Finally, refresh the watch expressions in the new element
				scope.$apply();
				//console.log('add?');
			});
		}, 50);
	}
}

//===============================================
// Node boolean
//===============================================
//`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`
threejsangular.component('nodebooleancomponent', {
	bindings: {
		params:'=',
		confirmed:'='
	},
  	controller:'nodebooleanCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>`+
					`<input type="checkbox" ng-model="confirmed" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodebooleanCtrl', function nodebooleanCtrl($scope) {
	function change() {
	  //console.log($scope.$ctrl.params);
	  _.set(selectnodeprops, $scope.$ctrl.params, $scope.confirmed);
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		$scope.confirmed = _.get(selectnodeprops, $scope.$ctrl.params);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

//===============================================
// node components
//===============================================
//`<nodecomponent ></nodecomponent>`
threejsangular.component('nodecomponent', {
	bindings: {
		//count: '='
	},
  	controller:'nodecomponentCtrl',
  	template: function($element, $attrs){
		//
		return 	``;
				//`<button ng-click="$ctrl.refresh();">Ctrl Refresh</button>`+
				//`<button clearobjectnodes>Clear Props</button>`;
	}
}).controller('nodecomponentCtrl', function nodecomponentCtrl($scope) {
	function refresh() {
		checknodecomponents();
		/*
		console.log('refesh props');
		var $target = document.getElementById('listcomponent');
		var myEl = angular.element(
			$target
		);
		myEl.empty();
		//console.log(this);
		angular.element($target).injector().invoke(function($compile) {
    		var scope = angular.element($target).scope();
    		angular.element($target).append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
    		// Finally, refresh the watch expressions in the new element
    		//scope.$apply();
			console.log('add?');
  		});
		*/
	}
	this.refresh = refresh;
	this.$onInit = function () {
    	// component initialisation
		//console.log($scope);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

threejsangular.directive("clearobjectnodes", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			//scope.count++;
			//console.log('add?');
			var myEl = angular.element(
				document.getElementById('listcomponent')
			);
			myEl.empty();
		});
	};
});

//Directive for adding buttons on click that show an alert on click
/*
threejsangular.directive("objectnodecomponets", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			//scope.count++;
			console.log('add?');
			var myEl = angular.element(
				document.getElementById('listcomponent')
			);
			//clear children
			myEl.empty();

			if(selectnodeprops['uuid'] !=null){
				myEl.append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
			}
			if(selectnodeprops['visible'] !=null){
				myEl.append($compile(`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['position'] !=null){
				myEl.append($compile(`<nodeinputcomponent params="params='position.x'"></nodeinputcomponent>`)(scope));
				myEl.append($compile(`<nodeinputcomponent params="params='position.y'"></nodeinputcomponent>`)(scope));
				myEl.append($compile(`<nodeinputcomponent params="params='position.z'"></nodeinputcomponent>`)(scope));
			}
		});
	};
});
*/
function checknodecomponents(){
	setTimeout(function () {
		var $target = document.getElementById('listcomponent');
		var myEl = angular.element(
			$target
		);
		myEl.empty();
		//console.log(this);
		angular.element($target).injector().invoke(function($compile) {
			var scope = angular.element($target).scope();
			var propEl = angular.element($target);
			if(selectnodeprops['uuid'] !=null){
				propEl.append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
			}
			if(selectnodeprops['visible'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['name'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='name'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['position'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='position.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='position.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='position.z'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['rotation'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='rotation.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='rotation.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='rotation.z'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['scale'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='scale.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='scale.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="params='scale.z'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['castShadow'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="params='castShadow'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['receiveShadow'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="params='receiveShadow'"></nodebooleancomponent>`)(scope));
			}

			if(selectnodeprops['autoUpdate'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="params='autoUpdate'"></nodebooleancomponent>`)(scope));
			}

			if(selectnodeprops['aspect'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='aspect'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['far'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='far'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['focalLength'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='focalLength'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['fov'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='fov'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['near'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='near'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['zoom'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="params='zoom'"></nodeinputcomponent>`)(scope));
			}
			// Finally, refresh the watch expressions in the new element
			scope.$apply();
			//console.log('add?');
		});
	}, 50);
}

//===============================================
//
//===============================================

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
		//console.log('scene???');
		//socketio.emit('getscene','threejseditor');
	}
}

function RefreshScript(){
	console.log('refresh script');
	if(socketio !=null){
		//console.log('scene???');
		//socketio.emit('getscene','threejseditor');
	}
}

function RefreshContent(){
	//console.log('refresh Content');
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
	if(selectnodeprops !=null){
		checknodecomponents();
		//console.log(selectnodeprops);
	}
}

function NodeSelectObject(args){
	//console.log('selected object');
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
