//testing
/*
var MyObject3D = function() {
    // Run the Mesh constructor with the given arguments
    THREE.Mesh.apply(this, arguments);
};
// Make MyObject3D have the same methods as Mesh
MyObject3D.prototype = Object.create(THREE.Mesh.prototype);
// Make sure the right constructor gets called
MyObject3D.prototype.constructor = MyObject3D;

Then to instantiate it:

var testGeo = new THREE.CubeGeometry(20, 20, 20);
var testMat = new Three.MeshNormalMaterial();
var thing = new MyObject3D(testGeo, testMat);
*/

declare var THREE:any;
declare var THREEx:any;

module ThreejsAPI{
	export class Game{
		scene:any;
		camera:any;
		renderer:any;
		canvas:any;
		cube:any;
		bcanvasRatio:boolean = true;

		constructor(){
			this.init();
		}

		init(){
			console.log("init");
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
			this.scene = new THREE.Scene();
			this.canvas = document.getElementById('myCanvas');
			this.renderer = new THREE.WebGLRenderer({canvas:this.canvas});
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			if(this.bcanvasRatio == true){
				var winResize   = new THREEx.WindowResize(this.renderer, this.camera)
			}

			this.createscene();
			this.update();
		}

		createscene(){
			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube = this.cube = new THREE.Mesh( geometry, material );
			this.scene.add( cube );
			this.camera.position.z = 5;
		}

		createscene_sample(){
			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube = this.cube = new THREE.Mesh( geometry, material );
			this.scene.add( cube );
			this.camera.position.z = 5;
		}

		update(){
			requestAnimationFrame(()=>{ this.update(); });
			if(this.cube !=null){
				this.cube.rotation.x += 0.1;
				this.cube.rotation.y += 0.1;
			}
			this.renderer.render(this.scene, this.camera);
		}

	}
	export class Editor{
		scene:any;
		camera:any;
		renderer:any;
		canvas:any;
		cube:any;
		io:any;

		constructor(){
			this.init();
		}
		init(){

		}
	}
}

var app = new ThreejsAPI.Game();
console.log(app);
