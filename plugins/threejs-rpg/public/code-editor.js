var socketio;
var editor;
var filename;
var projectid = "threejseditor";
//window load start three
function addListener(event, obj, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(event, fn, false);   // modern browsers
	} else {
		obj.attachEvent("on"+event, fn);          // older versions of IE
	}
}
function adaptEditor() {
	//var editor = ace.edit("editor");
	var editor = ace.edit("editor");
	var editorDiv = document.getElementById("layout_layout_panel_main");
	var chieght = parseInt(editorDiv.style.height) / editor.renderer.lineHeight;
	var chieght = (Math.floor(chieght) - 2  ) * editor.renderer.lineHeight; //round and multiple
	//console.log(chieght);
	document.getElementById('editor').style.height = chieght + 'px';
	editor.resize();
	chieght = null;
	editorDiv =null;
}

addListener("load", window,()=>{
	socketio = io();

	var pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 0px;';
	$('#layout').w2layout({
		name: 'layout',
		panels: [
			//{ type: 'top',  size: 33, resizable: true, style: pstyle},
			{ type: 'main', style: pstyle, resizable: true, content: '<div id="editor" />',
				toolbar: {
					items: [
						{ type: 'button',  id: 'coderefresh',  caption: '', icon: 'fa fa-refresh', hint: 'Refresh Script' },
						{ type: 'button',  id: 'codenew',  caption: '', icon: 'fa fa-plus-square-o', hint: 'New Script' },
						{ type: 'button',  id: 'coderename',  caption: '', icon: 'fa fa-pencil', hint: 'Rename Script' },
						{ type: 'button',  id: 'codesaveas',  caption: '', icon: 'fa fa-files-o', hint: 'Copy as' },
						{ type: 'html',  id: 'codedelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Script',
						html: '<div style="padding: 3px 10px;">'+
		                      ' Script Name:'+
		                      '    <input id="inputfilename" size="" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>'+
		                      '</div>'
						},
						{ type: 'menu',   id: 'codelanguage', caption: 'Language', icon: 'fa fa-file-code-o', items: [
			                { text: '.js', icon: 'fa fa-file-code-o'},
			                { text: '.json', icon: 'fa fa-file-code-o' },
			                { text: '.ts', icon: 'fa fa-file-code-o' },
							{ text: '.txt', icon: 'fa fa-file-code-o' },
							{ text: '.md', icon: 'fa fa-file-code-o' },
							{ text: '.html', icon: 'fa fa-file-code-o' },
							{ text: '.xml', icon: 'fa fa-file-code-o' }
			            ]},
						{ type: 'button',  id: 'codedelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Script' }
					],
					onClick: function (id, event) {
						//console.log(id);
						//console.log(event);
						if(event.target == 'codelanguage:.js'){
							editor.session.setMode("ace/mode/javascript");
						}
						if(event.target == 'codelanguage:.json'){
							editor.session.setMode("ace/mode/json");
						}
						if(event.target == 'codelanguage:.ts'){
							editor.session.setMode("ace/mode/typescript");
						}
						if(event.target == 'codelanguage:.txt'){
							editor.session.setMode("ace/mode/text");
						}
						if(event.target == 'codelanguage:.md'){
							editor.session.setMode("ace/mode/markdown");
						}
						if(event.target == 'codelanguage:.html'){
							editor.session.setMode("ace/mode/html");
						}
						if(event.target == 'codelanguage:.xml'){
							editor.session.setMode("ace/mode/xml");
						}
					}
				}
		 	},
			{ type: 'bottom', size: 33, resizable: true, style: pstyle,
			toolbar: {
				items: [
					{ type: 'button',  id: 'statusicon',  caption: '', icon: 'fa fa-terminal', hint: '' },
					{ type: 'html',  id: 'codedelete',  caption: '', icon: 'fa fa-trash-o', hint: 'Delete Script',
					html: '<div style="padding: 3px 10px;">'+
						  ' log:'+
						  '    <label id="logstatus" size="" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>'+
						  '</div>'
					},
				],
				onClick: function (id, event) {
					console.log(id);
					console.log(event);
					if(event.target == ''){

					}
				}
			}
		 	}
		]
	});
	//document.getElementById("logstatus").innerHTML = "none";
	$("#logstatus").text('none');
	//https://ace.c9.io/#nav=howto
	editor = ace.edit("editor");
	//editor.setTheme("ace/theme/twilight");
	editor.setTheme("ace/theme/chrome");
	editor.session.setMode("ace/mode/javascript");

	editor.getSession().on('change', function(e) {
    	// e.type, etc
		//console.log('change?');
	});

	editor.commands.addCommand({
	    name: 'SaveFile',
	    bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
	    exec: function(editor) {
			console.log('save?');
			console.log(editor.getValue());
			socketio.emit('code', {action:'save',projectid:projectid,name:filename,content:editor.getValue()} );
	    },
	    readOnly: true // false if this command should not apply in readOnly mode
	});
	//console.log(editor.getValue());
	window.onresize = function(event) {
		adaptEditor();
	};
	adaptEditor();
	//http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
	//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	//http://127.0.0.1/code-editor.html?file=test.js
	filename = location.search.split('file=')[1];
	//console.log(location.search);
	//console.log(filename);

	socketio.on('connect',()=>{
		console.log('connect');
		socketio.emit('code', {action:'get',projectid:projectid,name:filename} );
	});

	socketio.on('code',(data)=>{
		if(data['action'] != null){
			if(data['action'] == 'load'){
				if(data['name'] != null){
					filename = data['name'];
					$("#inputfilename").val(data['name']);
				}
				if(data['script'] != null){
					console.log('loaded script');
					editor.setValue(data['script'],-1);
					$("#logstatus").text('file loaded.');
					//editor.setValue(data['script']);
					//editor.setHighlightActiveLine(false);
				}
			}
			if(data['action'] == 'save'){
				$("#logstatus").text(data['message']);
			}
		}
	});
});
