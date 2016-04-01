$(document).ready(function () {
	Dropzone.autoDiscover = false;
	var exts = [
		'.jpg',
		'.png',
		'.jpeg',
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
	function getext(filename){
		return filename.substr(filename.lastIndexOf('.'));
	}
	var myDropzone = new Dropzone('#myCanvas',{
		url:"/file-upload",
		//dictDefaultMessage: "Drag your image here",
		//clickable:'#dropzonePreview',
		//previewTemplate:"<span></span>",
		init: function() {
			var myDropzone = this;
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
				threejsapi.LoadFile(file.name);
				//console.log();
				done();
			}
			bmatch = null;
		}

	});

	myDropzone.on("addedfile", function (file) {
		console.log("addedfile");
	});

	myDropzone.on("success", function (file) {
		console.log("success");
		//console.log(file);
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
});
