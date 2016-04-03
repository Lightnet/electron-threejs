$(document).ready(function () {
	console.log('init editor panel');
	var canvas_html ='<canvas id="myCanvas">'+
	'<form  action="/file-upload" method="post" class="dropzone" enctype="multipart/form-data">'+
		'<div class="fallback">'+
			'<input name="file" type="file" multiple />'+
		'</div>'+
	'</form>'
	'</canvas>';

	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	$('#layout').w2layout({
		name: 'layout',
		panels: [
			{ type: 'top',  size: 33, resizable: true, style: pstyle, content: '<div id="toolbar"></div>' },
			{ type: 'left', size: 200, resizable: true, style: pstyle, content: '<div id="sidebar_assets"></div>' },
			{ type: 'main', style: pstyle, resizable: false,overflow: 'hidden', content: canvas_html  },
			{ type: 'preview', size: '10%', resizable: true, style: pstyle, content: 'debug' },
			{ type: 'right', size: 200, resizable: true, style: pstyle, content: '<div id="sidebar_content"></div>' },
			{ type: 'bottom', size: 33, resizable: true, style: pstyle, content: '<div id="toolbar_bottom"></div>' }
		]
	});

	// then define the sidebar
	w2ui['layout'].content('left', $().w2sidebar({
		name: 'sidebar_assets',
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
		}
	}));

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
		}
	}));

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
			{ type: 'check',  id: 'snap', caption: 'snap', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'local', caption: 'local', img: 'icon-page', checked: false },
			{ type: 'check',  id: 'show', caption: 'show', img: 'icon-page', checked: true },
			{ type: 'break',  id: 'break1' },
			{ type: 'button',  id: 'status', text: 'status'},
			{ type: 'spacer' }
		],
		onClick: function(event) {
        	console.log('item '+ event.target + ' is clicked.');
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
