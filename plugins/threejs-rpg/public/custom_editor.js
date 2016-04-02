$(document).ready(function () {
	console.log('init editor panel');
	var canvas_html ='<canvas id="myCanvas">'+
	'<form  action="/file-upload" method="post" class="dropzone" enctype="multipart/form-data">'+
		'<div class="fallback">'+
			'<input name="file" type="file" multiple />'+
		'</div>'+
	'</form>'
	'</canvas>';

	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
	$('#layout').w2layout({
		name: 'layout',
		panels: [
			{ type: 'top',  size: 25, resizable: true, style: pstyle, content: 'top' },
			{ type: 'left', size: 200, resizable: true, style: pstyle, content: 'left' },
			{ type: 'main', style: pstyle, resizable: false,overflow: 'hidden', content: canvas_html  },
			{ type: 'preview', size: '10%', resizable: true, style: pstyle, content: 'debug' },
			{ type: 'right', size: 200, resizable: true, style: pstyle, content: 'right' },
			{ type: 'bottom', size: 25, resizable: true, style: pstyle, content: 'bottom' }
		]
	});
	$( window ).resize(function() {
		var mainpanel = document.getElementById("layout_layout_panel_main");
		var canvaspanel = document.getElementById("myCanvas");
		canvaspanel.style.width = mainpanel.style.width;
		canvaspanel.style.height = mainpanel.style.height;
	});
	//console.log(w2ui['layout'].get('main'));
});
