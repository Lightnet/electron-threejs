var socketio = io();
var threejsangular = angular.module('threejsangular', []);
var threejsapi;
var threejsapi_preview;
var threejsapi_play;
var projectid = "threejseditor";
var scripts = [];
var rename = '';
var assets = [];
var assets_select;
var contents = [];
var deletecontents = [];
var content_select;
var selectnodeprops; //object scene selected
var props = [];
var editor; //script editor

var textures = [];
var materials = [];
var objectmeshs = [];

var exts = [
	'.jpg',
	'.png',
	'.jpeg',
	'.gif',
	'.fbx',
	'.dae',
	'.obj',
	'.mtl',
	'.md',
	'.html',
	'.txt',
	'.ts',
	'.js',
	'.json'
];
//filter out files for manage
var extmesh = [
	'.fbx',
	'.dae',
	'.obj'
];

var extimages = [
	'.jpg',
	'.png',
	'.jpeg',
	'.gif'
];

var extcodes = [
	'.fbx',
	'.dae',
	'.obj',
	'.mtl',
	'.md',
	'.html',
	'.txt',
	'.ts',
	'.js',
	'.json'
];

//get file ext
function getext(filename){
	return filename.substr(filename.lastIndexOf('.'));
}

function initScriptEditor(){
	editor = ace.edit("editor");
	//editor.setTheme("ace/theme/twilight");
	editor.setTheme("ace/theme/chrome");
	editor.session.setMode("ace/mode/javascript");
	editor.setValue('//work in progress nothing added this for core setup threejs game and user interface.')
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
		threejsapi = new ThreejsAPI.Game({onload:false,bupdateobjects:false});
		//var player = threejsapi.createplayer();
		threejsapi_preview = new ThreejsAPI.Game({onload:false, canvasid:'objectCanvas'});
		threejsapi_play = new ThreejsAPI.Game({onload:false, canvasid:'playCanvas'});

		//console.log(player);
		RefreshAssets();
		initangularnode();
		RefreshContent();
		NodePropsRefresh();
		getScripts();
	}
});

function loadScripts(){
	for(var i = 0; i < scripts.length;i++){
		threejsapi.addScript(scripts[i].path);
	}
}

function getScripts(){
	socketio.emit('script',{action:'getscripts',projectid:projectid});
}

socketio.on('script',(data)=>{
	if(data['action'] !=null){
		if(data['action'] == 'clear'){
			scripts = [];
		}
		if(data['action'] == 'add'){
			//console.log(data);
			//console.log(data);
			scripts.push( {id:data['id'] ,name :data['name'], path:data['path'],script: data['script']});
			//scripts[ data['id']  ].path =  data['path'];
			//scripts[ data['id']  ].script =  data['script'];
			//console.log(scripts);
			//console.log(scripts.length);
		}
		if(data['action'] == 'length'){
			//console.log(scripts.length);
		}
		if(data['action'] == 'finish'){
			//console.log(scripts.length);
			loadScripts();
		}
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
		params:'=', //bind from element attribute
		textname:'=',
	},
	scope: {
		value:'=' //local var
	},
  	controller:'nodelabelCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.textname}}</label>:`+
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
		textname:'=',
		value:'='
	},
  	controller:'nodeinputCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.textname}}</label>`+
					`<input type="input" ng-model="value" ng-value="value" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodeinputCtrl', function nodeinputCtrl($scope) {
	function change() {
	  //console.log($scope.$ctrl.params);
	  _.set(selectnodeprops, $scope.$ctrl.params, $scope.value);
	  if($scope.$ctrl.params.match('geometry.parameters') !=null){
		  threejsapi.SetParamGeom(selectnodeprops);
	  }
	  //console.log(selectnodeprops);
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		//console.log(this);
		$scope.value = _.get(selectnodeprops, $scope.$ctrl.params);
		if($scope.$ctrl.params.match('geometry.parameters') !=null){
  		  threejsapi.SetParamGeom(selectnodeprops);
  	  	}
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
		textname:'=',
		confirmed:'='
	},
  	controller:'nodebooleanCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.textname}}</label>`+
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
// Node button display info
//===============================================
//`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`
threejsangular.component('nodedisplaycomponent', {
	bindings: {
		params:'=',
		textname:'=',
		idel:'=',
		confirmed:'='
	},
  	controller:'nodedisplayCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.textname}}</label>`+
					`<input type="checkbox"" ng-model="confirmed" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodedisplayCtrl', function nodedisplayCtrl($scope) {
	function change() {
	  //console.log($scope.$ctrl.params);

	  _.set(selectnodeprops, $scope.$ctrl.params, $scope.confirmed);
	  //console.log($scope.confirmed);
	  //console.log($scope.$ctrl.params);
	  //console.log(selectnodeprops);
	  if($scope.confirmed == true){
		  $('#'+$scope.$ctrl.idel).show();
	  }else{
		  $('#'+$scope.$ctrl.idel).hide();
	  }
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		$scope.confirmed = _.get(selectnodeprops, $scope.$ctrl.params);
		//console.log('$scope.confirmed');
		//console.log($scope.$ctrl.params + " : " + $scope.confirmed);
		//console.log(selectnodeprops);
		if($scope.confirmed == true){
  		  $('#'+$scope.$ctrl.idel).show();
  	  	}else{
  		  $('#'+$scope.$ctrl.idel).hide();
  	  	}
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

//===============================================
//
//===============================================
threejsangular.component('nodescriptscomponent', {
	bindings: {
		//params:'=',
		//confirmed:'='
		//scriptselect:'='
	},
	scope: {
		scriptselect:'=',
		scripts:'=' //local var
	},
  	controller:'nodescriptCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					//`<label>{{$ctrl.params}}</label>`+
					//`<input type="checkbox" ng-model="confirmed" ng-change="$ctrl.change()" />` +
					`Script:<select ng-change="$ctrl.change();" ng-model="$ctrl.scriptselect">`+
						`<option ng-repeat="script in scripts" ng-value="script.id">{{script.name}}</option>`+
					`</select>`+
					`<button ng-click="$ctrl.add();">add</button>`+
					`<button ng-click="$ctrl.remove();">remove</button>`+
					`<button ng-click="$ctrl.refresh();">refresh</button>`+
				`</div>`;
	}
}).controller('nodescriptCtrl', function nodescriptCtrl($scope) {
	function change() {
	  //console.log($scope.$ctrl.params);
	  //_.set(cube, $scope.$ctrl.params, $scope.confirmed);
	  console.log($scope.$ctrl.scriptselect);
	};
	this.change = change;
	function add(){
		//console.log('add');
		addScriptComponent($scope.$ctrl.scriptselect);
		//console.log($scope.$ctrl.scriptselect);
		//console.log($scope.scripts);
	}
	this.add = add;
	function remove(){
		//console.log($scope.$ctrl.scriptselect);
		removeScriptComponent($scope.$ctrl.scriptselect);
		//console.log('remove');
	}
	this.remove = remove;
	function refresh(){
		//console.log('refresh');
		$scope.scripts = scripts;
		//console.log(scripts);
	}
	this.refresh = refresh;
	this.$onInit = function () {
		$scope.scriptselect = 0;
		// component initialisation
		//$scope.confirmed = _.get(cube, $scope.$ctrl.params);
		$scope.scripts = scripts;
		//console.log(scripts);
		//$scope.scripts = [
    		//{'name': 'Mesh',
     		//'id': '0'},
    		//{'name': 'Animation',
     		//'id': '1'},
    		//{'name': 'Texture',
     		//'id': '2'}
  			//];
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

//===============================================
// object props edit data var
//===============================================
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
			var propE10 = angular.element($target);
			//selectnodeprops['']
			if(selectnodeprops['bdisplay'] == null){
				selectnodeprops['bdisplay'] = true;
			}
			//console.log(selectnodeprops['bdisplay']);
			//propE10.append($(`<div id='objectscene'>Object <button>Toggle</button></div>`).append($(`<div id=objectprops></div>`)) );
			//propE10.append($compile(`<div id='objectscene'>Object <button onclick="$('#objectvar').toggle();">Toggle</button></div>`)(scope));
			propE10.append($compile(`<div id='objectscene'>Object</div>`)(scope));
			if(selectnodeprops['bdisplay'] !=null){
				propE10.append($compile(`<nodedisplaycomponent params="'bdisplay'" textname="'Transform Information:'" idel="'objectvar'"></nodedisplaycomponent>`)(scope));
			}
			propE10.append($compile(`<div id=objectvar></div>`)(scope));
			if(selectnodeprops['bdisplay'] == false){
				$('#objectvar').hide();
			}
			//nodedisplaycomponent
			var propEl = angular.element(document.getElementById('objectvar'));
			//propEl.empty();


			if(selectnodeprops['uuid'] !=null){
				propEl.append($compile(`<nodelabelcomponent params="'uuid'" textname="'uuid'"></nodelabelcomponent>`)(scope));
			}
			if(selectnodeprops['visible'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="'visible'" textname="'visible'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['name'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'name'"  textname="'name'"></nodeinputcomponent>`)(scope));
			}

			if(selectnodeprops['geometry'] !=null){
				if(selectnodeprops['geometry']['parameters']){
					for(var p in selectnodeprops.geometry.parameters){
						//console.log(typeof selectnodeprops.geometry.parameters[p]);
						if(typeof selectnodeprops.geometry.parameters[p] != 'undefined'){
							//var ps = 'geometry.parameters.' + p;
							//cube.geometry.parameters.width = 5;
							//cube.geometry.parameters.verticesNeedUpdate = true;
							//cube.geometry.parameters.dynamic  = true;
							//console.log(cube.geometry);
							//console.log(ps);
							//console.log( selectnodeprops.geometry.parameters[p]);
							if(typeof selectnodeprops.geometry.parameters[p] == 'boolean'){
								propEl.append($compile(`<nodebooleancomponent params="'`+ 'geometry.parameters.' + p + `'" textname="'` + p + `'"></nodebooleancomponent>`)(scope));
							}else{
								propEl.append($compile(`<nodeinputcomponent params="'`+ 'geometry.parameters.' + p + `'" textname="'` + p + `'"></nodeinputcomponent>`)(scope));
							}
						}else{
							console.log("parameters null:"+p);
							console.log("parameters null:"+selectnodeprops.geometry.parameters[p]);
						}
					}
				}
			}

			if(selectnodeprops['position'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'position.x'" textname="'position.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'position.y'" textname="'position.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'position.z'" textname="'position.z'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['rotation'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'rotation.x'" textname="'rotation.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'rotation.y'" textname="'rotation.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'rotation.z'" textname="'rotation.z'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['scale'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'scale.x'" textname="'scale.x'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'scale.y'" textname="'scale.y'"></nodeinputcomponent>`)(scope));
				propEl.append($compile(`<nodeinputcomponent params="'scale.z'" textname="'scale.z'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['castShadow'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="'castShadow'" textname="'castShadow'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['receiveShadow'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="'receiveShadow'" textname="'receiveShadow'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['autoUpdate'] !=null){
				propEl.append($compile(`<nodebooleancomponent params="'autoUpdate'" textname="'autoUpdate'"></nodebooleancomponent>`)(scope));
			}
			if(selectnodeprops['aspect'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'aspect'" textname="'aspect'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['far'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'far'" textname="'far'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['focalLength'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'focalLength'" textname="'focalLength'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['fov'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'fov'" textname="'fov'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['near'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'near'" textname="'near'"></nodeinputcomponent>`)(scope));
			}
			if(selectnodeprops['zoom'] !=null){
				propEl.append($compile(`<nodeinputcomponent params="'zoom'" textname="'zoom'"></nodeinputcomponent>`)(scope));
			}
			// Finally, refresh the watch expressions in the new element
			//console.log('add?');
			if(selectnodeprops['script'] !=null){
				//var $target = document.getElementById('listcomponent');
				//var myEl = angular.element(
					//$target
				//);
				myEl.append($compile(`<nodescriptscomponent />`)(scope));
				//console.log('script init');
				for(var cn in selectnodeprops.script){
					//for(var sc in scomponent){
						//console.log(sc);
					//}
					var scriptc = selectnodeprops.script[cn];
					//myEl.append($compile(`<div>Script:`+cn+`<button onclick="$('#script_`+cn+`').toggle();">Toggle</button></div>`)(scope));
					myEl.append($compile(`<div><a href="/code-editor.html?file=`+cn+`.js" target="_blank">Script: `+cn+`.js</div>`)(scope));
					if(selectnodeprops.script[cn]['bdisplay'] == null){
						selectnodeprops.script[cn]['bdisplay'] = true;
					}
					var _scriptpath = 'script.' + cn + '.';


					//myEl.append($compile(`<nodedisplaycomponent params="'bdisplaytransform'" textname="'Object Information:'" idel="'script_`+cn+`'"></nodedisplaycomponent>`)(scope));
					myEl.append($compile(`<nodedisplaycomponent params="'` + _scriptpath + 'bdisplay' + `'" textname="'Display Component:'" idel="'script_`+cn+`'"></nodedisplaycomponent>`)(scope));

					myEl.append($compile(`<div id="script_`+cn+`"></div>`)(scope));

					var svarEl = angular.element(document.getElementById(`script_`+cn));
					for(var sc in scriptc){
						if(typeof scriptc[sc] == 'string'){
							svarEl.append($compile(`<nodeinputcomponent params="'` + _scriptpath + sc + `'" textname="'`+ sc +"" +`'"></nodeinputcomponent>`)(scope));
						}
						if(typeof scriptc[sc] == 'number'){
							svarEl.append($compile(`<nodeinputcomponent params="'` + _scriptpath + sc + `'" textname="'`+ sc +`'"></nodeinputcomponent>`)(scope));
						}
						if(typeof scriptc[sc] == 'boolean'){
							svarEl.append($compile(`<nodebooleancomponent params="'` + _scriptpath + sc + `'" textname="'`+ sc +`'"></nodebooleancomponent>`)(scope));
						}
						//console.log("TEXT:"+sc);
					}

					if(selectnodeprops.script[cn]['bdisplay'] == false){
						$('#'+`script_`+cn).hide();
					}
				}
			}else{
				//console.log('script not build');
			}
			scope.$apply();
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
//===============================================
// init script object3d scene
//===============================================
function ObjectAddScript(){
	if(selectnodeprops !=null){
		console.log('selectnodeprops');
		console.log(selectnodeprops);
		if(selectnodeprops['script'] == null){
			selectnodeprops['script'] = {};
		}
		console.log(selectnodeprops);
	}
}

//===============================================
// Script components
//===============================================
function addScriptComponent(id){
	if(selectnodeprops !=null){
		var scriptobject;
		for(i in scripts){
			if(scripts[i].id == id){
				console.log('found script file:'+scripts[i].name);
				scriptobject = scripts[i];
				break;
			}
		}
		//console.log(scriptobject);
		if(scriptobject !=null){
			//console.log(scriptobject);
			//scriptobject.name
			var oname = scriptobject.name.replace(/\.[^/.]+$/, "");
			//check if class var exist
			if(selectnodeprops.script[oname] == null){
				threejsapi.createComponent(selectnodeprops,oname);
				checknodecomponents();
			}else{
				console.log('class, variables, & function exist');
			}
			console.log(selectnodeprops);

			/*
			if(selectnodeprops.script[oname] == null){
				events = {
					init: [],
					start: [],
					stop: [],
					keydown: [],
					keyup: [],
					mousedown: [],
					mouseup: [],
					mousemove: [],
					touchstart: [],
					touchend: [],
					touchmove: [],
					update: []
				};

				var scriptWrapParams = 'renderer,scene,camera';
				var scriptWrapResultObj = {};

				for ( var eventKey in events ) {
					scriptWrapParams += ',' + eventKey;
					scriptWrapResultObj[ eventKey ] = eventKey;
				}
				var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );
				var functions = ( new Function(scriptWrapParams, scriptobject.script));
				//console.log(functions);

				selectnodeprops.script[oname] = ( new Function(scriptWrapParams, scriptobject.script + '\nreturn ' + scriptWrapResult + ';'  ).bind( selectnodeprops ) )();

				for ( var name in selectnodeprops.script[oname] ) {
						//console.log(name);
					if ( selectnodeprops.script[oname][ name ] === undefined ) continue;

					if ( events[ name ] === undefined ) {
						console.warn( 'APP.Player: Event type not supported (', name, ')' );
						continue;
					}
					events[ name ].push( selectnodeprops.script[oname][ name ].bind( selectnodeprops ) );
				}

				//console.log(selectnodeprops.script[oname]);
				//if(selectnodeprops.script[oname].init !=null){
					//selectnodeprops.script[oname].init();
				//}
				//console.log(selectnodeprops.script[oname]);
				//console.log(selectnodeprops);
				checknodecomponents();
			}else{
				console.log('class, variables, & function exist');
				//console.log(selectnodeprops);
			}
			*/
			//console.log(selectnodeprops);
		}
	}
}

function removeScriptComponent(id){
	if(selectnodeprops !=null){
		var scriptobject;
		for(i in scripts){
			if(scripts[i].id == id){
				console.log('found script file:'+scripts[i].name);
				scriptobject = scripts[i];
				break;
			}
		}
		if(scriptobject !=null){
			console.log(scriptobject);
			var name = scriptobject.name.replace(/\.[^/.]+$/, "");
			if(selectnodeprops.script[name] != null){
				selectnodeprops.script[name] = null;
				delete selectnodeprops.script[name];
			}else{
				console.log('class, variables, & function exist');
				console.log(selectnodeprops);
			}
			console.log(selectnodeprops);
		}
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

function DeleteNodeChildren(node){
	for(var i = 0;i < node.children.length;i++){
		DeleteNodeChildren(node.children[i]);
	}
	deletecontents.push(node.uuid);
	for(var ii = 0;ii < threejsapi.scenenodes.length;ii++){
		if(node.uuid == threejsapi.scenenodes[ii].uuid){
			threejsapi.scenenodes.splice(ii,1);
			console.log('remove');
			break;
		}
	}
	threejsapi.scene.remove(node);
}

function DeleteObjectNode(){
	console.log('DeleteObjectNode');
	console.log(content_select);
	if(content_select !=null){
		for(var i = 0;i < threejsapi.scenenodes.length;i++){
			if(threejsapi.scenenodes[i].uuid == content_select){
				DeleteNodeChildren(threejsapi.scenenodes[i]);
				break;
			}
		}
	}
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

//===============================================
// Object management
//===============================================

function SaveObjectS(obj){
	var objstring = JSON.stringify(obj);
	//console.log(objstring);
	socketio.emit('mapscene',{action:'save', projectid:projectid,uuid:obj.uuid,object:objstring});
}

function DeleteObjectS(uuid){
	socketio.emit('mapscene',{action:'delete',uuid:uuid});
}

function LoadObjectS(obj){
	socketio.emit('mapscene',{action:'load',projectid:projectid,name:'',uuid:''});
}

function LoadMapScene(){
	console.log('send socket.io loadmapscene');
	socketio.emit('mapscene',{action:'loadmapscene',projectid:projectid});
}

socketio.on('mapscene',function(data){
	if(data !=null){
		if(data['action'] !=null){
			if(data['action'] == 'clear'){
				console.log('clear mapscene!');
			}
			if(data['action'] == 'add'){
				//console.log(data);
				if(data.object){
					threejsapi.parseObject(data.object);
				}
			}
			if(data['action'] == 'message'){
				console.log(data['message']);
			}
		}
	}
});

//===============================================
// App Save & Load
//===============================================
function NewMap(){
	console.log('NewMap');
	//console.log(threejsapi.scene);
	//threejsapi.mapscenenodes = [];
	//threejsapi.scenenodes = [];
	//for( var i = threejsapi.scene.children.length - 1; i >= 1; i--) {
		//console.log('remove item?');
		//threejsapi.scene.remove(threejsapi.scene.children[i]);
	//}
}

function SaveMap(){
	console.log('SaveMap');
	//save object as json
	threejsapi.mapscenenodes = [];
	for(var is = 0; is < threejsapi.scenenodes.length;is++){
		console.log(threejsapi.scenenodes[is].name);
		var mapobj = new threejsapi.copyobjectprops(threejsapi.scenenodes[is]);
		threejsapi.mapscenenodes.push(mapobj);//rebuild object
	}

	for(var i = 0; i < threejsapi.mapscenenodes.length;i++){
		console.log(threejsapi.mapscenenodes[i]);
		SaveObjectS(threejsapi.mapscenenodes[i]);
	}
	//delete scene node objects
	for(var di = 0; di < deletecontents.length; di++){
		DeleteObjectS(deletecontents[di]);
	}
}

function LoadMap(){
	console.log('LoadMap');
	//console.log(threejsapi.scene);
	LoadMapScene();
}

function buildApp(){
	console.log('buildApp');
	//threejsapi.clearScripts();
}

function compileApp(){
	console.log('compileApp');
}

//===============================================
// Debug game setup
//===============================================
function AssignObjectId(object){
	object.userData.id = object.uuid;
	for(var i = 0; i < object.children.length;i++){
		if(object.children[i].children.length > 0){
			AssignObjectId(object.children[i]);
		}
	}
}

function CopyObjectData(object){
	//object.userData.id
	var tmpdata;
	for(var i = 0; i < threejsapi.scenenodes.length;i++){
		if(threejsapi.scenenodes[i].uuid == object.userData.id){
			tmpdata = threejsapi.scenenodes[i];
		}
	}
	if(tmpdata != null){
		if(tmpdata.script != null){
			//object.script = tmpdata.script;//doesn't copy right
			object.script={};
			for(var sc in tmpdata.script){
				threejsapi.createComponent(object, sc);
			}
		}
	}

	if(object.children.length > 0){
		for(var i = 0; i < object.children.length;i++){
			if(object.children[i].children.length > 0){
				CopyObjectData(object.children[i]);
			}
		}
	}
}

function InitObjectData(object){
	if(object.script != null){
		for(var sname in object.script){
			if(object.script[sname].init !=null){
				object.script[sname].init();
			}
		}
	}
	if(object.children.length > 0){
		for(var i = 0; i < object.children.length;i++){
			InitObjectData(object.children[i]);
		}
	}
}

function startApp(){
	console.log('startApp');
	for( var i = threejsapi_play.scene.children.length - 1; i >= 1; i--) {
		//console.log('remove item?');
		threejsapi_play.scene.remove(threejsapi_play.scene.children[i]);
	}
	//console.log("//=======================");
	AssignObjectId(threejsapi.scene);
	//copy scene and objects at once
	var clonescene = threejsapi.scene.clone();
	//console.log(threejsapi.scene);
	//console.log(clonescene);
	//copy script components
	CopyObjectData(clonescene);
	//init setup
	InitObjectData(clonescene);
	threejsapi_play.scene.add(clonescene);
	w2ui.tabs.click('tab4');
}
//remove play app from scene and stop update
function stopApp(){
	console.log('stopPlay');
	for( var i = threejsapi_play.scene.children.length; i > 0; i--) {
		//console.log('remove item?');
		var scene = threejsapi_preview.scene.children[i];
		threejsapi_play.scene.remove(threejsapi_play.scene.children[i]);
		delete scene;
	}
	//console.log(threejsapi_play.scene.children.length);
	//console.log(threejsapi_play.scene.children);
}
