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

*/

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
						{ type: 'button',  id: 'refresh',  caption: 'Refresh', icon: 'fa fa-refresh', hint: 'assets list' }
					],
					onClick: function (event) {
                        //this.owner.content('left', event);
						RefreshAssets();
                    }
				}
			},
			{ type: 'main', style: pstyle, resizable: false,overflow: 'hidden', content: canvas_html  },
			//{ type: 'preview', size: '10%', resizable: true, style: pstyle, content: 'debug' },
			{ type: 'right', size: 200, resizable: true, style: pstyle, content: '',
				toolbar: {
					items: [
						{ type: 'button',  id: 'refresh',  caption: 'Refresh', icon: 'fa fa-refresh', hint: 'Node list' }
					],
					onClick: function (event) {
						//this.owner.content('left', event);
						//console.log( 'id: ' + event.target);
						//RefreshScene();
						if(event.target == 'refresh'){
							RefreshContent();
						}

					}
				}
			},
			{ type: 'bottom', size: 33, resizable: true, style: pstyle, content: '<div id="toolbar_bottom"></div>' }
		]
	});

	w2ui['layout'].content('left', $().w2sidebar({
		name: 'sidebar_assets',
		img: null,
		nodes: [
			{ id: 'Assets', text: 'Assets', img: 'icon-folder', expanded: true, group: true,
			  nodes: [ { id: 'level-1-1', text: 'Level 1.1', icon: 'fa fa-file' },
					   { id: 'level-1-2', text: 'Level 1.2', icon: 'fa fa-file' },
					   { id: 'level-1-3', text: 'Level 1.3', icon: 'fa fa-file' }
					 ]
			}
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			//console.log( 'id: ' + event.target);
			//console.log(w2ui.sidebar_assets);
		}
	}));

	$().w2sidebar({
		name: 'sidebar_content',
		img: null,
		nodes: [
			{ id: 'scene', text: 'scene', img: 'icon-folder', expanded: true, group: true,
			  nodes: [ { id: 'level-1-1', text: 'Level 1.1', icon: 'fa fa-file' },
					   { id: 'level-1-2', text: 'Level 1.2', icon: 'fa fa-file' },
					   { id: 'level-1-3', text: 'Level 1.3', icon: 'fa fa-file' }
					 ]
			}
		],
		onClick: function (event) {
			//w2ui['layout'].content('main', 'id: ' + event.target);
			console.log( 'id: ' + event.target);
		}
	});

	var pstyle = 'background-color: #F0F0C1; border: 1px solid #dfdfdf; padding: 0px;';

	$().w2layout({
		 name: 'layout_props',
		 panels: [
			 { type: 'main', size: 200,resizable: true, style: pstyle, content: w2ui['sidebar_content'] },
			 { type: 'preview', size: 200, resizable: true, style: pstyle, content: 'preview' }
		 ]
    });

	w2ui['layout'].content('right', w2ui['layout_props']);

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
			]},
			{ type: 'spacer' },
			 { type: 'check',  id: 'autosave', caption: 'AutoSave', icon: 'w2ui-icon-check', checked: true }
		]
	});

	$('#toolbar_bottom').w2toolbar({
		name: 'toolbar_bottom',
		items: [
			{ type: 'radio',  id: 'translate',  group: '1', caption: 'translate', icon: 'fa fa-arrows', checked: true },
			{ type: 'radio',  id: 'rotate',  group: '1', caption: 'rotate', icon: 'fa fa-repeat' },
			{ type: 'radio',  id: 'scale',  group: '1', caption: 'scale', icon: 'fa fa-arrows-alt' },
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
