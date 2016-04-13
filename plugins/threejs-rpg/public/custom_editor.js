//http://w2ui.com/web/demos/#!sidebar/sidebar-2

/*
fa fa-file-audio-o
fa fa-file-archive-o
fa fa-file-image-o
fa fa-file-text
fa fa-file-archive-o
fa fa-file-audio-o
fa fa-file-image-o
fa fa-file-text-o

fa fa-file-code-o
fa fa-file-o
fa fa-file-video-o

fa fa-star-o
fa fa-star

fa fa-hashtag
fa fa-usb

fa fa-times
fa fa-cube
fa fa-eraser
fa-trash-o

fa fa-qrcode
fa fa-wrench
*/

//$(document).ready(function () {
function initEditor(){
	console.log('init editor panel');

	var tabs = `<div id="tab-example">
					<div id="tabs"></div>
				    <div id="tab1" class="tab">
					<canvas width="800px" height="600px" id="myCanvas">
						<form  action="/file-upload" method="post" class="dropzone" enctype="multipart/form-data">
							<div class="fallback">'+
								<input name="project" type="text" value="threejseditor"/>
								<input name="file" type="file" multiple />
							</div>
						</form>
					</canvas>
				    </div>
				    <div id="tab2" class="tab">
						<canvas width="800px" height="600px" id="objectCanvas">
						</canvas>
				    </div>
				    <div id="tab3" class="tab">
						<div id="editor" ></div>
				    </div>
				</div>`;
	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	$('#layout').w2layout({
		name: 'layout',
		panels: [
			{ type: 'top',  size: 33, resizable: true, style: pstyle},
			{ type: 'left', size: 200, resizable: true, style: pstyle, content: '',
				toolbar: {
					items: [
						{ type: 'button',  id: 'assetsrefresh',  caption: '', icon: 'fa fa-refresh', hint: 'Refresh Nodes' },
						{ type: 'button',  id: 'assetsadd',  caption: '', icon: 'fa fa-plus-square-o', hint: 'Add Node' },
						{ type: 'button',  id: 'assetsrename',  caption: '', icon: 'fa fa-pencil', hint: 'Rename Node' },
						{ type: 'button',  id: 'assetscopy',  caption: '', icon: 'fa fa-files-o', hint: 'Copy Node' },
						{ type: 'button',  id: 'assetsdelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Node' }
					],
					onClick: function (event) {
						if(event.target == 'assetsrefresh'){
							RefreshAssets();
						}
						if(event.target == 'assetsrename'){
							//$('#filename').value = "test";
							var filename = '';
							for(var i = 0; i < assets.length;i++ ){
								if(assets[i].id == assets_select){
									filename = assets[i].name;
									break;
								}
							}
							w2confirm('Rename file?<br><input id="filename" type="text" name="filename" value='+ filename +' >', function (btn) {
								//console.log(btn);
								//console.log($('#filename')[0].value);
								if(btn == 'Yes'){
									rename = $('#filename')[0].value;
									RenameAssets();
								}
							});
						}
						if(event.target == 'assetsdelete'){
							//DeleteAssets();
							w2confirm('Are you sure to delete file?', function (btn) {
								console.log(btn);
								if(btn == 'Yes'){
									DeleteAssets();
								}
							});
						}
                    }
				}
			},
			{ type: 'main', style: pstyle, resizable: false, overflow: 'hidden', content: tabs },
			//{ type: 'preview', size: '10%', resizable: true, style: pstyle, content: 'debug' },
			{ type: 'right', size: 300, resizable: true, style: pstyle, content: '' },
			{ type: 'bottom', size: 33, resizable: true, style: pstyle }
		]
	});

	var configtabs = {
		    tabs: {
		        name: 'tabs',
		        active: 'tab1',
		        tabs: [
		            { id: 'tab1', caption: 'Scene Editor' },
		            { id: 'tab2', caption: 'Object Editor' },
		            { id: 'tab3', caption: 'Script Editor' },
		        ],
		        onClick: function (event) {
		            $('#tab-example .tab').hide();
		            $('#tab-example #' + event.target).show();
		        }
		    }
		}

	$('#tabs').w2tabs(configtabs.tabs);
	//$('#tab1').hide();
    $('#tab1').show();
	$('#tab2').hide();
	$('#tab3').hide();
	//$('#tab3').show();

	//Assets sidebar
	w2ui['layout'].content('left', $().w2sidebar({
		name: 'sidebar_assets',
		img: null,
		nodes: [
			{ id: 'Assets', text: 'Assets', img: 'icon-folder', expanded: true, group: true }
		],
		onClick: function (event) {
			console.log( event);
			console.log( 'id: ' + event.target);
			//if(assets_select != null){
				assets_select = event.target;
			//}
		}
	}));

	//Node Sidebar
	$().w2sidebar({
		name: 'sidebar_content',
		img: null,
		expanded:true,
		nodes: [
			{ id: 'ContentNode', text: 'Node', img: 'icon-folder', expanded: true, group: true }
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			//console.log( 'id: ' + event.target);
			//list all objects node scene
			for (var i = 0; i < threejsapi.scenenodes.length;i++){
				//console.log(threejsapi.scenenodes[i]);
				if(event.target == threejsapi.scenenodes[i].uuid){
					//console.log(threejsapi.scenenodes[i]);
					threejsapi.selectobject = threejsapi.scenenodes[i];
					NodeSelectObject({object:threejsapi.scenenodes[i]});
					break;
				}
			}
		}
	});

	//props sidebar
	$().w2sidebar({
		name: 'sidebar_props',
		img: null,
		nodes: [
			{ id: 'NObject', text: 'Object', img: 'icon-folder', expanded: true, group: true }
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			//console.log( 'id: ' + event.target);
		}
	});

	w2ui.sidebar_props.on('*', function (id, data) {
		//console.log(id);
		//console.log(data);
		//console.log(' TARGET: '+ event.target);
		//threejsapi.toolbar(event.target);
    });

	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';

	//layout props
	$().w2layout({
		 name: 'layout_props',
		 panels: [
			 { type: 'main', size: 200,resizable: true, style: pstyle, content: w2ui['sidebar_content'],
				 toolbar: {
					 items: [
						 { type: 'button',  id: 'contentrefresh',  caption: '', icon: 'fa fa-refresh', hint: 'Refresh Node list' },
						 { type: 'button',  id: 'contentadd',  caption: '', icon: 'fa fa-plus-square-o', hint: 'Add Node' },
						 { type: 'button',  id: 'contentrename',  caption: '', icon: 'fa fa-pencil', hint: 'Rename Node' },
						 { type: 'button',  id: 'contentcopy',  caption: '', icon: 'fa fa-files-o', hint: 'Copy Node' },
						 { type: 'button',  id: 'contentdelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Node' }
					 ],
					 onClick: function (event) {
						 //this.owner.content('left', event);
						 //console.log( 'id: ' + event.target);
						 //RefreshScene();
						 if(event.target == 'contentrefresh'){
							 RefreshContent();
						 }
						 if(event.target == 'contentdelete'){
							 DeleteContent();
						 }
					 }
				 }
		 	 },
			 //{ type: 'preview', size: 300, resizable: true, style: pstyle, content:w2ui['sidebar_props'],
			 { type: 'preview', size: 300, resizable: true, style: pstyle, content:'<div id="objectprops"></div>',
				 toolbar: {
					 items: [
						 { type: 'button',  id: 'contentrefresh',  caption: '', icon: 'fa fa-refresh', hint: 'Refresh Nodes' },
						 { type: 'menu',  id: 'addcomponent',  caption: 'Add Component', icon: 'fa fa-plus-square', hint: 'Add Component',
							 items: [
				                { text: 'model', icon: 'fa fa-cube' },
								{ text: 'texture', icon: 'fa fa-file-image-o' },
								{ text: 'material', icon: 'fa fa-file-image-o' },
				                { text: 'animation', icon: 'fa fa-file-video-o' },
								{ text: 'collision', icon: 'fa fa-cube' },
								{ text: 'physics', icon: 'fa fa-street-view' },
								{ text: 'text', icon: 'fa fa-sticky-note-o' },
				                { text: 'script', icon: 'fa fa-file-code-o' }
				            ]
					 	 },
						 { type: 'button',  id: 'contentdelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Node' }
					 ],
					 onClick: function (event) {
						 //this.owner.content('left', event);
						 //console.log( 'id: ' + event.target);
						 //RefreshScene();
						 if(event.target == 'contentrefresh'){
							 NodePropsRefresh();
						 }
					 }
				 }
		 	}
		 ]
    });
	//add content layout
	w2ui['layout'].content('right', w2ui['layout_props']);

	//toolbar top
	$().w2toolbar({
		name: 'toolbar',
		items: [
			{ type: 'menu',   id: 'EditorFile', caption: 'File', items: [
				{type:'button', text: 'Open', icon: 'icon-page'},
				{type:'button', text: 'Close', icon: 'icon-page'},
				{type:'button', text: 'Import', icon: 'icon-page'},
				{type:'button', text: 'Export', icon: 'icon-page'},
				{type:'button', text: 'Publish', icon: 'icon-page'}
			]},
			{ type: 'menu',   id: 'EditorEdit', caption: 'Edit', items: [
				{ text: 'Copy', icon: 'icon-page' },
				{ text: 'Paste', icon: 'icon-page' },
				{ text: 'Delete', icon: 'icon-page' },
				{ text: 'Delete', icon: 'icon-page' },
				{ text: 'Clear History', icon: 'icon-page' },
			]},
			{ type: 'menu',   id: 'EditorComponents', caption: 'Components', items: [
				{ text: 'Object3D', icon: 'fa fa-cube' },
				{ text: 'Mesh', icon: 'fa fa-cube' },
				{ text: 'BoxGeometry', icon: 'fa fa-cube' },
				{ text: 'CircleGeometry', icon: 'fa fa-cube' },
				{ text: 'CylinderGeometry', icon: 'fa fa-cube' },
				{ text: 'SphereGeometry', icon: 'fa fa-cube' },
				//{ text: 'ShapeGeometry', icon: 'fa fa-cube' },
				{ text: 'PlaneGeometry', icon: 'fa fa-cube' },

				//{ text: 'RingGeometry', icon: 'fa fa-cube' },
				//{ text: 'TorusGeometry', icon: 'fa fa-cube' },
				//{ text: 'TorusKnotGeometry', icon: 'fa fa-cube' },

				{ text: 'TextGeometry', icon: 'fa fa-cube' },
				{ text: 'Sprite2D', icon: 'fa fa-cube' },

				{ text: 'ArrowHelper', icon: 'fa fa-cube' },
				{ text: 'AxisHelper', icon: 'fa fa-cube' },
				{ text: 'BoundingBoxHelper', icon: 'fa fa-cube' },
				//{ text: 'CameraHelper', icon: 'fa fa-cube' },
				//{ text: 'DirectionalLightHelper', icon: 'fa fa-cube' },
				{ text: 'EdgesHelper', icon: 'fa fa-cube' },
				{ text: 'FaceNormalsHelper', icon: 'fa fa-cube' },
				{ text: 'GridHelper', icon: 'fa fa-cube' },
				//{ text: 'HemisphereLightHelper', icon: 'fa fa-cube' },
				{ text: 'PointLightHelper', icon: 'fa fa-cube' },
				{ text: 'SpotLightHelper', icon: 'fa fa-cube' },
				{ text: 'VertexNormalsHelper', icon: 'fa fa-cube' },
				{ text: 'WireframeHelper', icon: 'fa fa-cube' },

				//{ text: 'Tetrahedron', icon: 'fa fa-cube' },
				//{ text: 'OctahedronGeometry', icon: 'fa fa-cube' },
				//{ text: 'DodecahedronGeometry', icon: 'fa fa-cube' },
				//{ text: 'IcosahedronGeometry', icon: 'fa fa-cube' },

				{ text:'',type: 'break', id: 'break' },
				{ text: 'model', icon: 'fa fa-cube' },
				{ text: 'texture', icon: 'fa fa-file-image-o' },
				{ text: 'material', icon: 'fa fa-file-image-o' },
				{ text: 'animation', icon: 'fa fa-file-video-o' },
				{ text: 'collision', icon: 'fa fa-cube' },
				{ text: 'physics', icon: 'fa fa-street-view' },
				{ text: 'text', icon: 'fa fa-sticky-note-o' },
				{ text: 'script', icon: 'fa fa-file-code-o' }
			]},
			{ type: 'button',   id: 'EditorPlay', caption: 'Play'},
			{ type: 'menu',   id: 'EditorPlayOtions', caption: '', items: [
				{ text: 'Play', icon: 'icon-page' },
				{ text: 'Debug', icon: 'icon-page' },
				{ text: 'Local', icon: 'icon-page' },
				{ text: 'Host & Local', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'EditorExample', caption: 'Example', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'EditorHelp', caption: 'Help',items: [
				{ text: 'API', icon: 'icon-page' },
				{ text: 'About', icon: 'icon-page' }
			]},
			{ type: 'button',   id: 'EditorCode', caption: 'CodeEditor'},
			{ type: 'button',   id: 'EditorViewObject', caption: 'View Object'},
			{ type: 'button',   id: 'EditorCompile', caption: 'Compile'},
			{ type: 'button',   id: 'EditorBuild', caption: 'Build'},
			{ type: 'spacer' },
			 { type: 'check',  id: 'projectautosave', caption: 'AutoSave', icon: 'w2ui-icon-check', checked: true }
		]
	});
	w2ui['layout'].content('top', w2ui['toolbar']);

	w2ui.toolbar.on('*', function (event) {
		if(event.target == 'EditorCode'){
			console.log(assets_select);
			if(assets_select !=null){
				var bfile = false;
				var tfilename;
				for(var i = 0; i < assets.length; i++ ){
					if(assets[i].id == assets_select){
						tfilename = assets[i].name;
						bfile = true;
						break;
					}
				}
				var checkext = getext(tfilename);
				var bmatch = false;
				if(bfile == true){
					for(var ii in extcodes) {
						//console.log(exts[i]);
						if( checkext == extcodes[ii] ){
							bmatch = true;
							break;
						}
					}
				}
				if((bmatch ==  true)&&(bfile ==  true)){
					window.open("http://127.0.0.1/code-editor.html"+'?file='+tfilename);
				}else{
					console.log('It not text file.');
				}

				bfile = null;
				bmatch = null;
				checkext = null;
				tfilename = null;
			}
		}
		if(event.target == 'EditorViewObject'){
			console.log(assets_select);
			if(assets_select !=null){
				var bfileimage = false;
				var bfilemesh = false;
				var bfile = false;
				var tfilename;
				var filepath;
				var texture;
				var mesh;
				for(var i = 0; i < assets.length; i++ ){
					if(assets[i].id == assets_select){
						tfilename = assets[i].name;
						filepath =  assets[i].path;
						bfile = true;
						break;
					}
				}
				var checkext = getext(tfilename);
				if(bfile == true){
					for(var ii in extimages) {
						//console.log(exts[i]);
						if( checkext == extimages[ii] ){
							bfileimage = true;
							break;
						}
					}
					for(var ii in extmesh) {
						//console.log(exts[i]);
						if( checkext == extmesh[ii] ){
							bfilemesh = true;
							break;
						}
					}
				}
				if((bfile ==  true)&&(bfileimage ==  true)){
					console.log('found texture');
					//window.open("http://127.0.0.1/code-editor.html"+'?file='+tfilename);

					//=========
					var bfound = false;
					for (var t in textures){
						if(textures[t].name == tfilename){
							bfound = true;
							texture = textures[t];
							break;
						}
					}

					if(bfound == false){
						for( var i = threejsapi_preview.scene.children.length - 1; i >= 1; i--) {
							console.log('remove item?');
							threejsapi_preview.scene.remove(threejsapi_preview.scene.children[i]);
						}
						console.log('remove item?'+threejsapi_preview.scene.children.length);
						console.log('texture added...');
						var map = new THREE.TextureLoader().load( filepath);
						map.name = tfilename;
						textures.push(map);
						console.log(map);
						var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
						var sprite = new THREE.Sprite( material );
						threejsapi_preview.scene.add( sprite );
						console.log(threejsapi_preview.scene);
					}else{
						for( var i = threejsapi_preview.scene.children.length - 1; i >= 1; i--) {
							threejsapi_preview.scene.remove(threejsapi_preview.scene.children[i]);
						}
						console.log('remove item?'+threejsapi_preview.scene.children.length);
						var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
						var sprite = new THREE.Sprite( material );
						threejsapi_preview.scene.add( sprite );
					}
					console.log('texture image');
					$('#tab-example .tab').hide();
		            $('#tab-example #' + 'tab2').show();
				}

				if((bfile ==  true)&&(bfilemesh ==  true)){
					console.log('found mesh object');
					var bfound = false;
					console.log(objectmeshs);
					for (var t in objectmeshs){
						console.log(objectmeshs[t]);
						if(objectmeshs[t].name == tfilename){
							bfound = true;
							mesh = objectmeshs[t];

							break;
						}
					}
					if(bfound == true){
						for( var i = threejsapi_preview.scene.children.length - 1; i >= 1; i--) {
							threejsapi_preview.scene.remove(threejsapi_preview.scene.children[i]);
						}
						//add mesh
						threejsapi_preview.scene.add( mesh );

					}else{
						for( var i = threejsapi_preview.scene.children.length - 1; i >= 1; i--) {
							threejsapi_preview.scene.remove(threejsapi_preview.scene.children[i]);
						}
						if(getext(tfilename) == '.fbx'){
							threejsapi_preview.LoadFBX(tfilename,(mesh)=>{
								objectmeshs.push(mesh);
								threejsapi_preview.scene.add(mesh);
							});
						}

						if(getext(tfilename) == '.dae'){
							threejsapi_preview.LoadDAE(tfilename,(mesh)=>{
								objectmeshs.push(mesh);
								threejsapi_preview.scene.add(mesh);
							});
						}

						if(getext(tfilename) == '.obj'){
							threejsapi_preview.LoadOBJ(tfilename,(mesh)=>{
								objectmeshs.push(mesh);
								threejsapi_preview.scene.add(mesh);
							});
						}
					}


					$('#tab-example .tab').hide();
		            $('#tab-example #' + 'tab2').show();
				}




				bfound = null;
				bfilemesh = null;
				bfile = null;
				bfileimage = null;
				bmatch = null;
				checkext = null;
				tfilename = null;
			}
		}
		if(event.target == 'EditorCompile'){

		}
		if(event.target == 'EditorBuild'){

		}

		console.log(' TARGET: '+ event.target);
		threejsapi.toolbar(event.target);
		//console.log(' TARGET: '+ event.target, event);
        //console.log('EVENT: '+ event.type + ' TARGET: '+ event.target, event);
    });

	//toolbar bottom
	$().w2toolbar({
		name: 'toolbar_bottom',
		items: [
			{ type: 'radio',  id: 'translate',  group: '1', caption: 'translate', icon: 'fa fa-arrows', checked: true },
			{ type: 'radio',  id: 'rotate',  group: '1', caption: 'rotate', icon: 'fa fa-repeat' },
			{ type: 'radio',  id: 'scale',  group: '1', caption: 'scale', icon: 'fa fa-arrows-alt' },
			{ type: 'break',  id: 'break0' },
			{ type: 'html',  id: 'unitsnap',
				html: '<div style="padding: 3px 10px;">'+
                      ' Snap:'+
                      '    <input size="10" style="padding: 1px; border-radius: 1px; border: 1px solid silver" value="0" />'+
                      '</div>' },
			{ type: 'check',  id: 'snap', caption: 'snap', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'local', caption: 'local', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'show', caption: 'show', img: 'icon-page', checked: true },
			{ type: 'break',  id: 'break1' },
			{ type: 'button',  id: 'status', text: 'status'},
			{ type: 'break',  id: 'break2' },
			{ type: 'button',  id: 'toggle_top', text: 'top'},
			{ type: 'button',  id: 'toggle_right', text: 'right'},
			{ type: 'button',  id: 'toggle_left', text: 'left'},
			{ type: 'button',  id: 'toggle_preview', text: 'preview'},
			{ type: 'spacer' },
			{ type: 'button',  id: 'test', text: 'test'}
		],
		onClick: function(event) {
        	console.log('item '+ event.target + ' is clicked.');
			if(event.target == 'toggle_top'){
				w2ui['layout'].toggle('top');
			}
			if(event.target == 'toggle_right'){
				w2ui['layout'].toggle('right');
			}
			if(event.target == 'toggle_left'){
				w2ui['layout'].toggle('left');
			}
			if(event.target == 'toggle_preview'){
				w2ui['layout'].toggle('preview');
			}
			if(event.target == 'test'){
				//console.log('remove?');
				//removenodelist(w2ui.sidebar_assets,w2ui.sidebar_assets.nodes[0].nodes);
			}
    	}
	});

	w2ui['layout'].content('bottom', w2ui['toolbar_bottom']);

	w2ui['layout'].on('resize', function(target, data) {
	    data.onComplete = function () {
			//console.log('resize?');
			//if(editor !=null){
				//editor.resize();
				//heightUpdateFunction();
			//}
			var mainpanel = document.getElementById("layout_layout_panel_main");
			var canvaspanel = document.getElementById("myCanvas");
			canvaspanel.style.width = mainpanel.style.width;
			canvaspanel.style.height = mainpanel.style.height;
		}
	});

	$( window ).resize(function() {
		var mainpanel = document.getElementById("layout_layout_panel_main");
		var canvaspanel = document.getElementById("myCanvas");
		canvaspanel.style.width = mainpanel.style.width;
		canvaspanel.style.height = mainpanel.style.height;
	});
	//console.log(w2ui['layout'].get('main'));
//});
};
