/*
	Name:
	Link:https://github.com/Lightnet/electron-threejs
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/



//$(document).ready(function () {
function initDropzone(){
	Dropzone.autoDiscover = false;
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
		'.xml',
		'.txt',
		'.ts',
		'.js',
		'.json'
	];
	function getext(filename){
		return filename.substr(filename.lastIndexOf('.'));
	}
	$(".dz-hidden-input").prop("disabled",true);
	var myDropzone = new Dropzone('#layout_layout_panel_main',{
		url:"/file-upload",
		//dictDefaultMessage: "Drag your image here",
		//clickable:'#dropzonePreview',
		//previewTemplate:"<span></span>",
		init: function() {
			var myDropzone = this;
			$('.dropzone').removeClass('dz-clickable'); // remove cursor
            $('.dropzone')[0].removeEventListener('click', this.listeners[1].events.click);
			//console.log("init dropzone");
		},
		accept: function(file, done) {
			//file.name
			var bmatch = false;
			var ext = getext(file.name);
			console.log(ext);
			for(var i in exts) {
				//console.log(exts[i]);
				if( ext == exts[i] ){
					bmatch = true;
					break;
				}
			}
			if(bmatch == false){
				done();
				//done("Denied file.");
				console.log("Can't uploaded this file is Denied!");
				myDropzone.removeFile(file);
			}else{
				//console.log();
				done();
			}
			bmatch = null;
		}

	});
	myDropzone.on('processing', function(file){
    	console.log("Processing the file");
    	myDropzone.options.url = "/file-upload?projectid="+'threejseditor';
	});

	myDropzone.on("addedfile", function (file) {
		console.log("addedfile");
	});

	myDropzone.on("success", function (file) {
		console.log("success");
		//console.log(file);
		if(threejsapi !=null){
			threejsapi.LoadFile(file.name);
		}
		setTimeout(function() {
			RefreshAssets();
		}, 50);
		myDropzone.removeFile(file);
		//var value = $("#file").val();
		//$("#file").val(value + ';' + responsetext.Url);
	});

	myDropzone.on("error", function (file) {
		console.log("error");
		//console.log(file);
		myDropzone.removeFile(file);
		//var value = $("#file").val();
		//$("#file").val(value + ';' + responsetext.Url);
	});
//});
};
