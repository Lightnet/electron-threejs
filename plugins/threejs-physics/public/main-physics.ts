//testing
//three.d.ts
/// <reference path="../../../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-orbitcontrols.d.ts" />
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

/*
//make sure it not null
	if(scene !=null){
		scene.traverse( function ( object ) {
			//update object Physics
			if ( object.UpdatePhysics){//make sure the function is not null
				object.UpdatePhysics();
			}
			//if ( object instanceof THREE.ObjPrefabShip ) {object.update();}
		});
	}

*/

//declare var THREE:any;
declare var OIMO:any;
declare var THREEx:any;
declare var CANNON:any;
declare var Ammo:any;
//declare var window:any;
/*
var DEBUG = false;
if(!DEBUG){
    //if(!window.console) window.console = {};
    //var methods = ["log", "debug", "warn", "info"];
	var methods = ["debug", "warn", "info"];
    for(var i=0;i<methods.length;i++){
    	console[methods[i]] = function(){};
    }
}
*/
module ThreejsAPI{
	export class Game{
		version:string = "0.0.1";

		antialias:boolean = true;
		bablenetwork:boolean = false;

		buffgeoSphere:any;
		buffgeoBox:any;
		matSphere:any;
		matBox:any;
		matSphereSleep:any;
		matGround:any;
		matBoxSleep:any;
		matGroundTrans:any;
		materialType:any = 'MeshBasicMaterial';

		scene:any;
		camera:any;
		renderer:any;
		canvas:any;
		cube:any;
		bcanvasRatio:boolean = true;
		//physics begin
		infos:any;
		physicsIndex:number = 2;
		setPhysicsType = ['Oimo.js','Cannon.js','Ammo.js'];
		collisionConfiguration:any;
		dispatcher:any;
		overlappingPairCache:any;
		solver:any;
		trans:any;
		dp:any;
		bablephysics:boolean = true;

		world:any = null;
		//physics end

		meshs:any = [];
		bodies:any = [];
		grounds:any = [];

		customscript:any = [];

		// HUD Begin
		hudCanvas:any;
		cameraHUD:any;
		sceneHUD:any;
		hudTexture:any;
		hudBitmap:any;
		// HUD End
		controls:any;
		ToRad:number = 0.0174532925199432957;
		timeSteptimeStep:number = 1/60;

		constructor(){
			//listen to load event
			this.addListener("load", window,()=>{
				console.log('init...');
				this.init();
			});
		}

		//window load start three
		addListener(event, obj, fn) {
		    if (obj.addEventListener) {
		        obj.addEventListener(event, fn, false);   // modern browsers
		    } else {
		        obj.attachEvent("on"+event, fn);          // older versions of IE
		    }
		}

		init(){
			console.log("init");
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 10000 );
			this.camera.position.set( 0, 160, 400 );

			this.scene = new THREE.Scene();
			this.canvas = document.getElementById('myCanvas');
			this.renderer = new THREE.WebGLRenderer({canvas:this.canvas,precision: "mediump",antialias:this.antialias});
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.autoClear = false;

			this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;

			if(this.bcanvasRatio == true){
				var winResize = new THREEx.WindowResize(this.renderer, this.camera)
			}

			this.controls = new THREE.OrbitControls( this.camera, this.canvas );
        	this.controls.target.set(0, 20, 0);
        	this.controls.update();
			// materials
			this.matSphere = new THREE[ this.materialType ]( { map: this.basicTexture(0), name:'sph' } );
	        this.matBox = new THREE[this.materialType]( {  map: this.basicTexture(2), name:'box' } );
	        this.matSphereSleep = new THREE[this.materialType]( { map: this.basicTexture(1), name:'ssph' } );
	        this.matBoxSleep = new THREE[this.materialType]( {  map: this.basicTexture(3), name:'sbox' } );
	        this.matGround = new THREE[this.materialType]( { color: 0x3D4143, transparent:true, opacity:0.5 } );
	        this.matGroundTrans = new THREE[this.materialType]( { color: 0x3D4143, transparent:true, opacity:0.6 } );

			this.buffgeoSphere = new THREE.BufferGeometry();
	        this.buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1 , 20, 10 ) );

	        this.buffgeoBox = new THREE.BufferGeometry();
	        this.buffgeoBox.fromGeometry( new THREE.BoxGeometry( 1, 1, 1 ) );

			//background
			this.createTexMat();
			//this.createHUD();
			//this.createscene();//simple test
			this.initPhysics();

			this.createscene_cube();

			this.createplayer();

			this.update();
		}

		initObjectClasses(){

		}

		createplayer(){
			var player = new THREE.Object3D();
			player.init = function(){

			};
			player.update = function(){
				//console.log("update?");
			};


			this.scene.add(player);
			console.log(player);
		}

		createcharacter(){

		}

		initPhysics(){
			if(this.setPhysicsType[this.physicsIndex] == 'Oimo.js'){
				this.initOimoPhysics();
			}
			if(this.setPhysicsType[this.physicsIndex] == 'Cannon.js'){
				this.initCannonPhysics();
			}
			if(this.setPhysicsType[this.physicsIndex] == 'Ammo.js'){
				this.initAmmoPhysics();
			}
		}

		basicTexture(n){
	        var canvas = document.createElement( 'canvas' );
	        canvas.width = canvas.height = 64;
	        var ctx = canvas.getContext( '2d' );
	        var colors = [];
	        if(n===0){ // sphere
	            colors[0] = "#58AA80";
	            colors[1] = "#58FFAA";
	        }
	        if(n===1){ // sphere sleep
	            colors[0] = "#383838";
	            colors[1] = "#38AA80";
	        }
	        if(n===2){ // box
	            colors[0] = "#AA8058";
	            colors[1] = "#FFAA58";
	        }
	        if(n===3){ // box sleep
	            colors[0] = "#383838";
	            colors[1] = "#AA8038";
	        }
	        ctx.fillStyle = colors[0];
	        ctx.fillRect(0, 0, 64, 64);
	        ctx.fillStyle = colors[1];
	        ctx.fillRect(0, 0, 32, 32);
	        ctx.fillRect(32, 32, 32, 32);
	        var tx = new THREE.Texture(canvas);
	        tx.needsUpdate = true;
	        return tx;
	    }

		createTexMat(){
			// background
	        var buffgeoBack = new THREE.BufferGeometry();
	        buffgeoBack.fromGeometry( new THREE.IcosahedronGeometry(8000,1) );
	        var back = new THREE.Mesh( buffgeoBack, new THREE.MeshBasicMaterial( { map:this.gradTexture([[1,0.75,0.5,0.25], ['#1B1D1E','#3D4143','#72797D', '#b0babf']]), side:THREE.BackSide, depthWrite: false }  ));
	        back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15*this.ToRad));
	        this.scene.add( back );
		}

		gradTexture(color) {
	        var c = document.createElement("canvas");
	        var ct = c.getContext("2d");
	        c.width = 16; c.height = 256;
	        var gradient = ct.createLinearGradient(0,0,0,256);
	        var i = color[0].length;
	        while(i--){ gradient.addColorStop(color[0][i],color[1][i]); }
	        ct.fillStyle = gradient;
	        ct.fillRect(0,0,16,256);
	        var texture = new THREE.Texture(c);
	        texture.needsUpdate = true;
	        return texture;
    	}

		createHUD(){
			this.hudCanvas = document.createElement('canvas');
			var width = window.innerWidth;
			var height = window.innerHeight;

			// Again, set dimensions to fit the screen.
		    this.hudCanvas.width = window.innerWidth;
		    this.hudCanvas.height = window.innerHeight;

			// Get 2D context and draw something supercool.
		    this.hudBitmap = this.hudCanvas.getContext('2d');
		  	this.hudBitmap.font = "Normal 40px Arial";
		    this.hudBitmap.textAlign = 'center';
		    this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
		    this.hudBitmap.fillText('Initializing...', width / 2, height / 2);

			// Create the camera and set the viewport to match the screen dimensions.
			this.cameraHUD = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0, 30 );

			// Create also a custom scene for HUD.
			this.sceneHUD = new THREE.Scene();

		   	// Create texture from rendered graphics.
		   	this.hudTexture = new THREE.Texture(this.hudCanvas)
		   	this.hudTexture.needsUpdate = true;

			// Create HUD material.
			var material = new THREE.MeshBasicMaterial( {map: this.hudTexture} );
			material.transparent = true;

			// Create plane to render the HUD. This plane fill the whole screen.
			var planeGeometry = new THREE.PlaneGeometry( width, height );
			var plane = new THREE.Mesh( planeGeometry, material );
			this.sceneHUD.add( plane );
		}

		addStaticBox(size, position, rotation, spec){
			//console.log(this.buffgeoBox);
	        var mesh;
	        if(spec) mesh = new THREE.Mesh( this.buffgeoBox, this.matGroundTrans );
	        else mesh = new THREE.Mesh( this.buffgeoBox, this.matGround );
	        mesh.scale.set( size[0], size[1], size[2] );
	        mesh.position.set( position[0], position[1], position[2] );
	        mesh.rotation.set( rotation[0]* this.ToRad, rotation[1]*this.ToRad, rotation[2]*this.ToRad );
	        this.scene.add( mesh );
	        this.grounds.push(mesh);
	        mesh.castShadow = true;
	        mesh.receiveShadow = true;
	    }

		// Cannon
		initCannonPhysics(){
			if(typeof CANNON != undefined){
				this.world = new CANNON.World();
				this.world.gravity.set(0,-9.82,0);
				this.world.broadphase = new CANNON.NaiveBroadphase();
          		this.world.solver.iterations = 10;
			}
			this.createCannonScene();
		}

		createCannonScene(){
			//var groundShape = new CANNON.Plane();
			//var groundBody = new CANNON.Body({ mass: 0 });
			//groundBody.addShape(groundShape);
			//groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
			//this.world.add(groundBody);

			//var ground = this.world.add({name:"ground",size:[400, 40, 400], pos:[0,-20,0], config:config});
        	//this.addStaticBox( [400, 40, 400], [0,-20,0], [0,0,0], false);

			var boxShape1 = new CANNON.Box(new CANNON.Vec3(200,20,200));//half extend
			var boxBody1 = new CANNON.Body({ mass: 0 ,position:new CANNON.Vec3(0,-20,0)});
            boxBody1.addShape(boxShape1);
			this.world.add(boxBody1);
			this.addStaticBox( [400, 40, 400], [0,-20,0], [0,0,0], false);

			var boxShape2 = new CANNON.Box(new CANNON.Vec3(100,15,195));//half extend
			console.log(-Math.PI/2);
			var boxBody2 = new CANNON.Body({ mass: 0});
            boxBody2.addShape(boxShape2);
			boxBody2.position = new CANNON.Vec3(130,40,0);
			boxBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),(30 * Math.PI / 180));
			//boxBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),(0.5235987756));
			console.log(boxBody2.quaternion);
			this.world.add(boxBody2);

			//var geometry = new THREE.BoxGeometry( 200, 30, 390 );
			//var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
			//var cube = this.cube = new THREE.Mesh( geometry, material );
			//cube.quaternion.copy(boxBody2.quaternion);
			//cube.position.copy(boxBody2.position);
			//this.scene.add( cube );
			this.addStaticBox([200, 30, 390], [130,40,0], [0,0,32], false);



			var mass = 5, radius = 2;
			var sphereShape = new CANNON.Sphere(radius); // Step 1
			var sphereBody = new CANNON.Body({mass:mass}); // Step 2
			sphereBody.addShape(sphereShape);
			//sphereBody.position.set(0,100,0);
			//sphereBody.angularVelocity.set(0,10,0);
          	sphereBody.angularDamping = 0.5;
			sphereBody.addEventListener("collide", function(e){ console.log("sphere collided"); } );
			this.bodies[0] = sphereBody;

			var x = 150;
            var z = -100 + Math.random()*200;
            var y = 100 + Math.random()*1000;
			sphereBody.position.set(x,y,z);

			this.world.add(sphereBody); // Step 3
			//console.log(sphereBody);


			var buffgeoSphere = new THREE.BufferGeometry();
        	buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 2 , 20, 10 ) );

			this.meshs[0] = new THREE.Mesh( buffgeoSphere, this.matSphere );
			this.scene.add( this.meshs[0] );


			//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			//var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
			//var cube = this.cube = new THREE.Mesh( geometry, material );
			//this.scene.add( cube );
			//this.meshs[0] = cube;

		}

		updateCannonPhysics(){
			if(typeof CANNON != undefined){
				//var timeStep = 1.0 / 60.0; // seconds
				//this.world.step(timeStep);
				//timeStep = null;
				//world.gravity.set(0,0,-9.82);

				this.world.step(this.timeSteptimeStep);
				//https://github.com/schteppe/cannon.js/issues/188
				//var result = [];
				//this.world.narrowphase.getContacts([bodyA], [bodyB], this.world, result, [], [], []);
				//var overlaps = result.length > 0;

				for(var i = 0; i < this.bodies.length;i++){
					var mesh = this.meshs[i];
					var body = this.bodies[i];
					//console.log(body.sleeping);
					//if(!body.sleeping){
						//console.log(body.position);
						mesh.position.copy(body.position);
						//console.log(mesh.position);
	                	mesh.quaternion.copy(body.quaternion);
						//if(mesh.position.y<-100){
	                    	//var x = 150;
	                    	//var z = -100 + Math.random()*200;
	                    	//var y = 100 + Math.random()*1000;
	                    	//body.resetPosition(x,y,z);
	                	//}
					//}
				}
			}
		}

		destroyCannonPhysics(){

		}

		// Ammo
		initAmmoPhysics(){
			//https://github.com/kripken/ammo.js/blob/master/examples/hello_world.js
			if(typeof Ammo != undefined){
				console.log('init Ammo');
				this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
				this.dispatcher = this.dp = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
				//console.log(dispatcher);
				this.overlappingPairCache = new Ammo.btDbvtBroadphase();
				this.solver = new Ammo.btSequentialImpulseConstraintSolver();
				this.world = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
				this.world.setGravity(new Ammo.btVector3(0, -10, 0));

				this.trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking

				this.createAmmoScene();
			}
		}

		createAmmoScene(){
			//this.camera.position.set( 0, 50, 50 );
			//this.controls.target.set(0, 0, 0);
        	//this.controls.update();

			//ground
			var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200));//half extent
			var groundTransform = new Ammo.btTransform();
  			groundTransform.setIdentity();
  			groundTransform.setOrigin(new Ammo.btVector3(0, -20, 0));

			var mass = 0;
			var isDynamic = mass !== 0;
			var localInertia = new Ammo.btVector3(0, 0, 0);
			if (isDynamic)
      			groundShape.calculateLocalInertia(mass, localInertia);

			var myMotionState = new Ammo.btDefaultMotionState(groundTransform);
	    	var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
	    	var body = new Ammo.btRigidBody(rbInfo);
			//console.log(body);
			this.world.addRigidBody(body);
			this.addStaticBox( [400, 40, 400], [0,-20,0], [0,0,0], false);

			var groundShape2 = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200));//half extent
			var groundTransform2 = new Ammo.btTransform();
  			groundTransform2.setIdentity();
  			groundTransform2.setOrigin(new Ammo.btVector3(130, 40, 0));
			var q = new Ammo.btQuaternion(0,0,0.25881904510252074,0.9659258262890683);
			//Ammo.js rotation angles doesn't work. use quat (date:2016.03.30  version:unknown)
			//q.setEulerZYX(0,0,30);
			//q.setEulerZYX(0,0,(30 * Math.PI / 180));
			//console.log(q);
			groundTransform2.setRotation(q);
			console.log(groundTransform2);
			var localInertia2 = new Ammo.btVector3(0, 0, 0);
			if (isDynamic)
      			groundShape2.calculateLocalInertia(mass, localInertia2);
			var myMotionState2 = new Ammo.btDefaultMotionState(groundTransform2);
	    	var rbInfo2 = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState2, groundShape2, localInertia2);
	    	var body2 = new Ammo.btRigidBody(rbInfo2);
			//console.log(body);
			this.world.addRigidBody(body2);
			//var geometry = new THREE.BoxGeometry( 200, 30, 390 );
			//var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
			//var cube = this.cube = new THREE.Mesh( geometry, material );
			//cube.quaternion.copy(body2.quaternion);
			//cube.position.copy(body2.position);

			//cube.position.set(groundTransform2.getOrigin().x().toFixed(2),
							  //groundTransform2.getOrigin().y().toFixed(2),
							  //groundTransform2.getOrigin().z().toFixed(2));

		   //cube.rotation.set(groundTransform2.getRotation().x().toFixed(2),
							 //groundTransform2.getRotation().y().toFixed(2),
							 //groundTransform2.getRotation().z().toFixed(2),
							 //groundTransform2.getRotation().w().toFixed(2));

			//this.scene.add( cube );


			this.addStaticBox([200, 30, 390], [130,40,0], [0,0,32], false);

			var x = 150;
            var z = -100 + Math.random()*200;
            var y = 100 + Math.random()*1000;


			//sphere
			var colShape = new Ammo.btSphereShape(1);
		    var startTransform = new Ammo.btTransform();
		    startTransform.setIdentity();
		    var mass = 1;
		    var isDynamic = (mass != 0);
		    var localInertia = new Ammo.btVector3(0, 0, 0);
		    if (isDynamic)
		      colShape.calculateLocalInertia(mass,localInertia);
		    //startTransform.setOrigin(new Ammo.btVector3(2, 10, 0));
			startTransform.setOrigin(new Ammo.btVector3(x, y, z));


			//console.log(startTransform);
		    var myMotionState = new Ammo.btDefaultMotionState(startTransform);
		    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia);
		    var body = new Ammo.btRigidBody(rbInfo);
			//body.getMotionState().getWorldTransform(this.trans);
			//console.log(this.trans);
			//console.log(this.trans.getRotation());
		    this.world.addRigidBody(body);
		    this.bodies.push(body);

			var buffgeoSphere = new THREE.BufferGeometry();
        	buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1 , 20, 10 ) );

			this.meshs[0] = new THREE.Mesh( buffgeoSphere, this.matSphere );
			this.scene.add( this.meshs[0] );

			//var geometry = new THREE.BoxGeometry( 2, 2, 2 );
			//var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
			//var cube = this.cube = new THREE.Mesh( geometry, material );
			//cube.position.y = 5;
			//this.scene.add( cube );
			//this.meshs[0] = cube;

		}

		updateAmmoPhysics(){
			if(typeof Ammo != undefined){
				this.world.stepSimulation(1/60, 10);

				var i,
    			dp = this.dp,
    			num = dp.getNumManifolds(),
    			manifold, num_contacts, j, pt;

				for (i = 0; i < num; i++) {
				    manifold = dp.getManifoldByIndexInternal(i);

				    num_contacts = manifold.getNumContacts();
				    if (num_contacts === 0) {
				        continue;
				    }

				    for (j = 0; j < num_contacts; j++) {
				        pt = manifold.getContactPoint(j);
				        //console.log('body 1: ', manifold.getBody0());
				        //console.log('body 2: ', manifold.getBody1());
				        //console.log('COLLISION DETECTED!');
				        // HERE: how to get impact force details?
				        // pt.getAppliedImpulse() is not working
				    }
				}

				for(var ii = 0; ii < this.bodies.length;ii++){
					var mesh = this.meshs[ii];
					var body = this.bodies[ii];
					//console.log(body.sleeping);
					if (body.getMotionState()) {
						body.getMotionState().getWorldTransform(this.trans);
						//console.log("world pos = " + [this.trans.getOrigin().x().toFixed(2), this.trans.getOrigin().y().toFixed(2), this.trans.getOrigin().z().toFixed(2)]);

						mesh.position.set(this.trans.getOrigin().x().toFixed(2),
										  this.trans.getOrigin().y().toFixed(2),
										  this.trans.getOrigin().z().toFixed(2));

                       mesh.rotation.set(this.trans.getRotation().x().toFixed(2),
										 this.trans.getRotation().y().toFixed(2),
										 this.trans.getRotation().z().toFixed(2),
									 	 this.trans.getRotation().w().toFixed(2));
										 //console.log("world pos = " + [this.trans.getRotation().x().toFixed(2), this.trans.getRotation().y().toFixed(2), this.trans.getRotation().z().toFixed(2), this.trans.getRotation().w().toFixed(2)]);

					}
				}
			}
		}

		destroyAmmoPhysics(){
			//https://github.com/kripken/ammo.js/blob/master/examples/hello_world.js
			// Delete objects we created through |new|. We just do a few of them here, but you should do them all if you are not shutting down ammo.js
  			Ammo.destroy(this.collisionConfiguration);
  			Ammo.destroy(this.dispatcher);
  			Ammo.destroy(this.overlappingPairCache);
  			Ammo.destroy(this.solver);
		}

		// Oimo
		initOimoPhysics(){
			if(typeof OIMO != undefined){
				this.world = new OIMO.World(1/60, 2);
				//this.world.gravity = new OIMO.Vec3(0, -1, 0);
				this.world.clear();
				this.createOimoScene();
				this.infos = document.getElementById("info");
			}
		}

		createOimoScene(){
			console.log('init oimo.js');

			// The Bit of a collision group
			var group1 = 1 << 0;  // 00000000 00000000 00000000 00000001
        	var group2 = 1 << 1;  // 00000000 00000000 00000000 00000010
        	var group3 = 1 << 2;  // 00000000 00000000 00000000 00000100
        	var all = 0xffffffff; // 11111111 11111111 11111111 11111111
			// Is all the physics setting for rigidbody
	        var config = [
	            1, // The density of the shape.
	            0.4, // The coefficient of friction of the shape.
	            0.2, // The coefficient of restitution of the shape.
	            1, // The bits of the collision groups to which the shape belongs.
	            0xffffffff // The bits of the collision groups with which the shape collides.
	        ];

			//add ground
        	var ground = this.world.add({name:"ground",size:[400, 40, 400], pos:[0,-20,0], config:config});
        	this.addStaticBox( [400, 40, 400], [0,-20,0], [0,0,0], false);
        	var ground2 = this.world.add({name:"ground2",size:[200, 30, 390], pos:[130,40,0], rot:[0,0,32], config:config});
			this.addStaticBox([200, 30, 390], [130,40,0], [0,0,32], false);

			config[3] = group1;
	        config[4] = all & ~group2; // all exepte groupe2
	        var ground3 = this.world.add({name:"ground3",size:[5, 100, 390], pos:[0,40,0], rot:[0,0,0], config:config});
	        this.addStaticBox([5, 100, 390], [0,40,0], [0,0,0], true);

			var x = 150;
            var z = -100 + Math.random()*200;
            var y = 100 + Math.random()*1000;
            var w = 10 + Math.random()*10;
            var h = 10 + Math.random()*10;
            var d = 10 + Math.random()*10;

			var buffgeoSphere = new THREE.BufferGeometry();
        	buffgeoSphere.fromGeometry( new THREE.SphereGeometry( 1 , 20, 10 ) );
			config[4] = all;

			config[3] = group2;//
            this.bodies[0] = this.world.add({type:'sphere', size:[w*0.5], pos:[x,y,z], move:true, config:config});
			this.bodies[0].name = "sphere";
            this.meshs[0] = new THREE.Mesh( buffgeoSphere, this.matSphere );
			//console.log(this.world);
			//console.log(this.bodies[0]);
			//this.bodies[0].addEventListener("collide", function(e){ console.log("sphere collided"); } );//nope
			//this.bodies[0].on('collision',()=>{});

			//console.log(this.meshs[0]);
            this.meshs[0].scale.set( w*0.5, w*0.5, w*0.5 );
			this.scene.add( this.meshs[0] );

		}

		updateOimoPhysics(){
			//https://github.com/lo-th/Oimo.js/blob/gh-pages/test_moving.html
			if((typeof this.world == 'undefined')||(this.world == null)){
				return;
			}
			this.world.step();
			this.infos.innerHTML = this.world.performance.show();

			// contact test
			 if(this.world.checkContact('ground', 'sphere')){
				 //console.log('ground' +' [touch] ' + 'sphere');
			 }

			 if(this.world.checkContact('ground2', 'sphere')){
				 //console.log('ground2' +' [touch] ' + 'sphere');
			 }

			 if(this.world.checkContact('ground3', 'sphere')){
				 //console.log('ground3' +' [touch] ' + 'sphere');
			 }

			for(var i = 0; i < this.bodies.length;i++){
				var mesh = this.meshs[i];
				var body = this.bodies[i];
				if(!body.sleeping){
					mesh.position.copy(body.getPosition());
					//console.log(mesh.position);
                	mesh.quaternion.copy(body.getQuaternion());
					//console.log(body.numContacts);
					if(body.numContacts > 0){
						//console.log(body.next);
						//console.log(body.next.name);
						//console.log(body.next);
						//if(body.next != null){
							//body.next = null;
						//}
						//console.log(body.prev);
						//contactLink
					}
					if(mesh.position.y<-100){
                    	var x = 150;
                    	var z = -100 + Math.random()*200;
                    	var y = 100 + Math.random()*1000;
                    	body.resetPosition(x,y,z);
                	}
				}
			}
		}

		destroyOimoPhysics(){

		}

		createscene_cube(){
			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
			var cube = this.cube = new THREE.Mesh( geometry, material );
			this.scene.add( cube );
			//this.camera.position.z = 5;
		}

		createscene(){
			var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
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

		updatePhysics(){
			if(this.setPhysicsType[this.physicsIndex] == 'Oimo.js'){
				this.updateOimoPhysics();
			}
			if(this.setPhysicsType[this.physicsIndex] == 'Cannon.js'){
				this.updateCannonPhysics();
			}
			if(this.setPhysicsType[this.physicsIndex] == 'Ammo.js'){
				this.updateAmmoPhysics();
			}
		}

		//update scene and physics
		update(){
			requestAnimationFrame(()=>{ this.update(); });
			var width = window.innerWidth;
			var height = window.innerHeight;

			if(this.cube !=null){
				this.cube.rotation.x += 0.1;
				this.cube.rotation.y += 0.1;
			}
			//custom update function check
			if(this.scene !=null){
				this.scene.traverse(function(object){
					if(typeof object.update != 'undefined'){
						object.update();
					}
				});
			}

			// Render scene.
		    this.renderer.render(this.scene, this.camera);
			/*
			// Update HUD graphics.
			if(this.hudBitmap !=null){
				this.hudBitmap.clearRect(0, 0, window.innerWidth, window.innerHeight);
				this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
				if(this.cube !=null){
					//this.hudBitmap.fillText("RAD [x:"+(this.cube.rotation.x % (2 * Math.PI)).toFixed(1)+", y:"+(this.cube.rotation.y % (2 * Math.PI)).toFixed(1)+", z:"+(this.cube.rotation.z % (2 * Math.PI)).toFixed(1)+"]" , width / 2, height / 2);
				}
				this.hudTexture.needsUpdate = true;
			}
		    // Render HUD on top of the scene.
			if((this.sceneHUD !=null)&&(this.cameraHUD !=null)){
				this.renderer.render(this.sceneHUD, this.cameraHUD);
			}
			*/

			this.updatePhysics();

			width = null;
			height = null;
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
//console.log(app);
