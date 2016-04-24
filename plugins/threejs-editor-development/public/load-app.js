/*
	Name:
	Link:https://github.com/Lightnet/electron-threejs
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/



var loader = new THREE.XHRLoader();
var threejsapi;

//https://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
function loadScript(url, callback){
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }
    script.src = url;
	var scriptcomponents  = document.getElementById('scriptcomponents');
    //document.getElementsByTagName("head")[0].appendChild(script);
	scriptcomponents.appendChild(script);
}

loader.load( 'post-app.json', function ( text ) {
	var modelfiles = [];
	var modelcount = 0;

	mappdata = JSON.parse( text );
	console.log(mappdata);
	threejsapi = new ThreejsAPI.Game({onload:false,bcanvasRatio:true,bfixedassetpath:false});//config
	scriptcount = 0;

	if(mappdata.assets !=null){
		for(var i = 0; i < mappdata.assets.length;i++){
			console.log(mappdata.assets[i]);
			if(mappdata.assets[i].type == "model"){
				modelfiles.push(mappdata.assets[i]);
				//modelcount += 1;
			}
		}
		console.log("model id::");
		for(var mi = 0; mi < modelfiles.length;mi++){
			//console.log(modelfiles[mi].uuid);
			var _id = modelfiles[mi].uuid;
			var _name = modelfiles[mi].path;
			//console.log('//=========================');
			//console.log(modelfiles[mi].path);
			threejsapi.LoadModelFile(modelfiles[mi],(object)=>{
				console.log('//========================================');
				//console.log(object.name);
				//object.name = _name;
				//console.log(object.uuid);
				//object.uuid = _id;
				console.log(object);
				//console.log(object.uuid);
				modelcount++;
				console.log("models: "+modelcount + ":" +(modelfiles.length));
				if(modelcount == modelfiles.length){
					console.log('Finish loading file models!');
					console.log('init scripts!');
					loadscriptfiles();
				}
			});
		}
	}

	//load scripts
	function loadscriptfiles(){
		if(mappdata.scripts !=null){
			for(var i = 0; i < mappdata.scripts.length;i++){
				//threejsapi.addScript(mappdata.scripts[i]);
				loadScript(mappdata.scripts[i], function(){
	    			//initialization code
					scriptcount++;
					console.log("script: "+scriptcount + ":" + (mappdata.scripts.length));
					if(scriptcount == mappdata.scripts.length){ //make sure the scripts are load else it can't used script components
						console.log('Finish script components!');
						console.log('init load entities!');
						loadentities();
					}
				});
			}
		}
	}
	//load entities
	function loadentities(){
		console.log('loading entities?');
		if(mappdata.entities !=null){
			for(var i = 0; i < mappdata.entities.length;i++){
				threejsapi.parseObject(mappdata.entities[i]);
			}
			console.log('Finish loading/creating entities!');
		}
	}

	//function canvas_resize(){
		//var mainpanel = document.getElementById("layout_layout_panel_main");
		//var canvaspanel3 = document.getElementById("myCanvas");
		//if(canvaspanel3 !=null){
			//console.log("resize");
			//console.log(window.innerHeight);
			//canvaspanel3.style.width = window.innerWidth;
			//canvaspanel3.style.height = window.innerHeight;
		//}
	//}

	//$( window ).resize(function() {
		//console.log('resize window?');
		//canvas_resize();
	//});
});
