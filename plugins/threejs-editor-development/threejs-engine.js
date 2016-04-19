window ={};
document = {};
Ammo = {};

//webgl null function for headless server
var webgl_null = function(){};
//headless null all functions
webgl_null.prototype={
    getParameter:function(){},
    getExtension:function(){},
    disable:function(){},
    blendFunc:function(){},
    blendEquation:function(){},
    colorMask:function(){},
    enable:function(){},
    cullFace:function(){},
    depthMask:function(){},
    clearDepth:function(){},
    clearColor:function(){},
    createBuffer:function(){},
    bindBuffer:function(){},
    bufferData:function(){},
    getError:function(){},
    vertexAttribPointer:function(){},
    deleteBuffer:function(){},
    createShader:function(){},
    shaderSource:function(){},
    compileShader:function(){},
    createProgram:function(){},
    attachShader:function(){},
	createTexture:function(){},
	bindTexture:function(){},
	texParameteri:function(){},
	texImage2D:function(){},
	clearStencil:function(){},
	depthFunc:function(){},
	frontFace:function(){},
	scissor:function(){},
	viewport:function(){},
	clear:function(){},
	blendEquationSeparate:function(){},
	blendFuncSeparate:function(){},
	getShaderParameter:function(){},
	getShaderInfoLog:function(){},
	linkProgram:function(){},
	getProgramInfoLog:function(){},
	getProgramParameter:function(){},
	deleteShader:function(){},
	useProgram:function(){},
	uniformMatrix4fv:function(){},
	lineWidth:function(){},
	drawElements:function(){},
};

var THREE = require('three');
//console.log(THREE);

//load web browser variable & functions
//https://github.com/tmpvar/jsdom
var canvas;
var scene, camera, renderer;
var geometry, material, mesh;

var fps = require('fps')
var ticker = fps({
    every: 60   // update every 10 frames
});
var n = 10;
var interval;
var jsdom = require("jsdom").jsdom;
var cdocument = jsdom("<html><body><canvas id='application-canvas'></canvas></body></html>", {});
var jsdom = require("jsdom");
jsdom.env({
	url: "http://127.0.0.1/",
	onload: function( owindow ) {
        //console.log(owindow.location.href); // http://localhost/?something=not#hash
        //console.log(owindow.location.hash); // #hash
		window = owindow;
		document = window.document;
		Ammo = require('ammo.js');
		console.log("loaded window browser");

		window.WebGLRenderingContext = true;
		canvas = cdocument.getElementById("application-canvas");

		init();
		//interval = setInterval(function() {
			//animate();
		//}, 1000 / 60)

		interval = setInterval(function() {
			animate();
			console.log(ticker.rate);
  			if (n--) return ticker.tick();
			//clearInterval(interval);
		}, 1000 / 60);




		//animate();
		//process.nextTick(animate);
    }
});



function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	geometry = new THREE.BoxGeometry( 200, 200, 200 );
	material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	canvas.getContext = function(canvas,options){
	    //webgl_null functions
	    return new webgl_null();
	}

	//renderer = new THREE.WebGLRenderer();
	renderer = new THREE.WebGLRenderer({ canvas: canvas });
	//renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	//document.body.appendChild( renderer.domElement );

}
//var count = 0;
function animate() {
	//count++;
	//count = count % 60;
	//console.log("================="+count);
	//requestAnimationFrame( animate );
	//console.log('update?');
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

	renderer.render( scene, camera );
	//process.nextTick(animate);
}
