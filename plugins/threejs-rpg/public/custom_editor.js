$(document).ready(function () {
	console.log('init editor panel');
	var canvas_html ='<canvas id="myCanvas">'+
	'<form  action="/file-upload" method="post" class="dropzone" enctype="multipart/form-data">'+
		'<div class="fallback">'+
			'<input name="project" type="text" value="threejseditor"/>'+
			'<input name="file" type="file" multiple />'+
		'</div>'+
	'</form>'
	'</canvas>';

	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	$('#layout').w2layout({
		name: 'layout',
		panels: [
			{ type: 'top',  size: 33, resizable: true, style: pstyle, content: '<div id="toolbar"></div>' },
			{ type: 'left', size: 200, resizable: true, style: pstyle, content: '',
				toolbar: {
					items: [
						{ type: 'button',  id: 'refresh',  caption: 'Refresh', icon: 'w2ui-icon-check', hint: 'assets list' }
					],
					onClick: function (event) {
                        //this.owner.content('left', event);
						RefreshAssets();
                    }
				}
			},
			{ type: 'main', style: pstyle, resizable: false,overflow: 'hidden', content: canvas_html  },
			{ type: 'preview', size: '10%', resizable: true, style: pstyle, content: 'debug' },
			{ type: 'right', size: 200, resizable: true, style: pstyle, content: '',
				toolbar: {
					items: [
						{ type: 'button',  id: 'refresh',  caption: 'Refresh', icon: 'w2ui-icon-check', hint: 'scene list' }
					],
					onClick: function (event) {
						//this.owner.content('left', event);
						RefreshScene();
					}
				}
			},
			{ type: 'bottom', size: 33, resizable: true, style: pstyle, content: '<div id="toolbar_bottom"></div>' }
		]
	});

	// then define the sidebar
	w2ui['layout'].content('left', $().w2sidebar({
		name: 'sidebar_assets',
		//topHTML:'<button onclick="RefreshAssets();">Refresh</button>',
		img: null,
		nodes: [
			{ id: 'Assets', text: 'Assets', img: 'icon-folder', expanded: true, group: true,
			  nodes: [ { id: 'level-1-1', text: 'Level 1.1', icon: 'fa-home' },
					   { id: 'level-1-2', text: 'Level 1.2', icon: 'fa-star' },
					   { id: 'level-1-3', text: 'Level 1.3', icon: 'fa-check' }
					 ]
			}
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			console.log( 'id: ' + event.target);
			console.log(w2ui.sidebar_assets);

		}
	}));

	w2ui.sidebar_assets.insert('level-1-2', null, [
		{ id: 'new-4', text: 'New Item 4', icon: 'w2ui-icon-check' },
		{ id: 'new-5', text: 'New Item 5', icon: 'w2ui-icon-check' },
		{ id: 'new-6', text: 'New Item 6', icon: 'w2ui-icon-check' }
	]);

	w2ui['layout'].content('right', $().w2sidebar({
		name: 'sidebar_content',
		img: null,
		nodes: [
			{ id: 'scene', text: 'scene', img: 'icon-folder', expanded: true, group: true,
			  nodes: [ { id: 'level-1-1', text: 'Level 1.1', icon: 'fa-home' },
					   { id: 'level-1-2', text: 'Level 1.2', icon: 'fa-star' },
					   { id: 'level-1-3', text: 'Level 1.3', icon: 'fa-check' }
					 ]
			}
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			console.log( 'id: ' + event.target);
			/*
			//http://w2ui.com/web/demos/#!sidebar/sidebar-2
			console.log( 'id: ');
			w2ui.sidebar_content.insert('level-1-2', null, [
		        { id: 'new-4', text: 'New Item 4', icon: 'w2ui-icon-check' },
		        { id: 'new-5', text: 'New Item 5', icon: 'w2ui-icon-check' },
		        { id: 'new-6', text: 'New Item 6', icon: 'w2ui-icon-check' }
		    ]);
			*/
		}
	}));

	console.log(w2ui['sidebar_content']);
	/*
	w2ui['sidebar_content'].add([
        { id: 'new-1', text: 'New Item 1', icon: 'w2ui-icon-check' },
        { id: 'new-2', text: 'New Item 2', icon: 'w2ui-icon-check' },
        { id: 'new-3', text: 'New Item 3', icon: 'w2ui-icon-check' }
    ]);
	*/

	//w2ui.layout.show('right');
	//w2ui.layout.hide('right');

	$('#toolbar').w2toolbar({
		name: 'toolbar',
		items: [
			{ type: 'menu',   id: 'File', caption: 'File', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'Edit', caption: 'Edit', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'Components', caption: 'Components', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'Play', caption: 'Play', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'Example', caption: 'Example', items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]},
			{ type: 'menu',   id: 'Help', caption: 'Help',items: [
				{ text: 'Item 1', icon: 'icon-page' }
			]}
		]
	});

	$('#toolbar_bottom').w2toolbar({
		name: 'toolbar_bottom',
		items: [
			{ type: 'radio',  id: 'translate',  group: '1', caption: 'translate', icon: 'fa-star', checked: true },
			{ type: 'radio',  id: 'rotate',  group: '1', caption: 'rotate', icon: 'fa-star-empty' },
			{ type: 'radio',  id: 'scale',  group: '1', caption: 'scale', icon: 'fa-star-empty' },
			{ type: 'break',  id: 'break0' },
			{ type: 'html',  id: 'unitsnap',
				html: '<div style="padding: 3px 10px;">'+
                      ' Snap:'+
                      '    <input size="10" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="0" />'+
                      '</div>' },
			{ type: 'check',  id: 'snap', caption: 'snap', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'local', caption: 'local', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'show', caption: 'show', img: 'icon-page', checked: true },
			{ type: 'break',  id: 'break1' },
			{ type: 'button',  id: 'status', text: 'status'},
			{ type: 'spacer' },
			{ type: 'button',  id: 'test', text: 'test'}
		],
		onClick: function(event) {
        	console.log('item '+ event.target + ' is clicked.');
			if(event.target == 'test'){
				console.log('remove?');
				//w2ui.sidebar_assets.nodes[0].nodes = [];
				removenodelist(w2ui.sidebar_assets,w2ui.sidebar_assets.nodes[0].nodes);
				/*
				for(var i = 0; i < w2ui.sidebar_assets.nodes[0].nodes.length;i++){
					console.log(w2ui.sidebar_assets.nodes[0].nodes[i].id);
					w2ui.sidebar_assets.remove(w2ui.sidebar_assets.nodes[0].nodes[i].id);
				}
				removenodelist(w2ui.sidebar_assets.nodes[0]);
				*/
			}
    	}
	});



	w2ui['layout'].on('resize', function(target, data) {
	    data.onComplete = function () {
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
});
