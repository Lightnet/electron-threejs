//testing
//three.d.ts
/// <reference path="../../../DefinitelyTyped/threejs/detector.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-copyshader.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-effectcomposer.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-maskpass.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-orbitcontrols.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-orthographictrackballcontrols.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-projector.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-renderpass.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-shaderpass.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-trackballcontrols.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-transformcontrols.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-vreffect.d.ts" />
/// <reference path="../../../DefinitelyTyped/threejs/three-orbitcontrols.d.ts" />
//declare var window:any;
//var undefined:string = 'undefined';
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
var ThreejsAPI;
(function (ThreejsAPI) {
    //http://codepen.io/ryonakae/pen/PPKxyw
    var Game = (function () {
        // }
        function Game(args) {
            var _this = this;
            // {
            this.antialias = true;
            this.bablenetwork = false;
            this.materialType = 'MeshBasicMaterial';
            this.bprototype = false;
            this.scenes = [];
            this.currentscene = "scene";
            this.currenthudscene = "hud";
            this.cameras = [];
            this.bcanvasRatio = false;
            this.brenderersize = false;
            this.physicsIndex = 2;
            this.setPhysicsType = ['Oimo.js', 'Cannon.js', 'Ammo.js'];
            this.bablephysics = true;
            this.world = null;
            this.editornode = [];
            this.scenenodes = [];
            this.mapscenenodes = [];
            this.bupdateobjects = true; //make sure it doesn't update for editor
            this.meshs = [];
            this.bodies = [];
            this.grounds = [];
            //scripts
            //customscript:any = [];
            //scriptlist:any = [];
            this.loadedscript = [];
            this.scriptcomponents = [];
            this.ToRad = 0.0174532925199432957;
            this.timeSteptimeStep = 1 / 60;
            //listen to load event
            if (args != null) {
                if (args['canvasid'] != null) {
                    //this.bcanvas = true;
                    this.canvasid = args['canvasid'];
                }
                if (args['bprototype'] != null) {
                    //this.bcanvas = true;
                    this.bprototype = args['bprototype'];
                }
                if (args['bupdateobjects'] != null) {
                    //this.bcanvas = true;
                    this.bupdateobjects = args['bupdateobjects'];
                }
                //this need to be last else it variable are not assign
                if (args['onload'] == true) {
                    this.addListener("load", window, function () {
                        console.log('init threejs editor listen...');
                        _this.init();
                    });
                }
                else {
                    console.log('init  threejs editor...');
                    this.init();
                }
            }
            else {
            }
            return this;
        }
        //window load start three
        Game.prototype.addListener = function (event, obj, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(event, fn, false); // modern browsers
            }
            else {
                obj.attachEvent("on" + event, fn); // older versions of IE
            }
        };
        Game.prototype.init = function () {
            //console.log("//==========================================");
            //console.log("init threejs engine");
            this.initManger();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.name = "camera";
            //this.camera.position.set( 0, 160, 400 );
            //this.camera.position.set( 0, 10, 10 );
            this.camera.position.set(0, 0, 10);
            //console.log(this.camera);
            //this.scenenodes.push(this.camera);
            this.scene = new THREE.Scene();
            this.scene.name = "scene";
            this.scene.uuid = 'B1E79603-A80E-4CE5-9C5E-34B223CEECF9';
            console.log(this.scene);
            this.scene.userData.test = 'test';
            this.scenenodes.push(this.scene);
            //this.scene.add(this.camera);
            //console.log(this.scene);
            if (this.canvasid == null) {
                this.canvas = document.getElementById('myCanvas');
            }
            else {
                //console.log("get canvasid: "+this.canvasid);
                this.canvas = document.getElementById(this.canvasid);
            }
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, precision: "mediump", antialias: this.antialias });
            if (this.brenderersize) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFShadowMap; //THREE.BasicShadowMap;
            if (this.bcanvasRatio == true) {
                var winResize = new THREEx.WindowResize(this.renderer, this.camera);
            }
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            //this.controls.target.set(0, 20, 0);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
            // materials
            this.matSphere = new THREE[this.materialType]({ map: this.basicTexture(0), name: 'sph' });
            this.matBox = new THREE[this.materialType]({ map: this.basicTexture(2), name: 'box' });
            this.matSphereSleep = new THREE[this.materialType]({ map: this.basicTexture(1), name: 'ssph' });
            this.matBoxSleep = new THREE[this.materialType]({ map: this.basicTexture(3), name: 'sbox' });
            this.matGround = new THREE[this.materialType]({ color: 0x3D4143, transparent: true, opacity: 0.5 });
            this.matGroundTrans = new THREE[this.materialType]({ color: 0x3D4143, transparent: true, opacity: 0.6 });
            this.buffgeoSphere = new THREE.BufferGeometry();
            this.buffgeoSphere.fromGeometry(new THREE.SphereGeometry(1, 20, 10));
            this.buffgeoBox = new THREE.BufferGeometry();
            this.buffgeoBox.fromGeometry(new THREE.BoxGeometry(1, 1, 1));
            //background
            this.createTexMat();
            //this.createscene_cube();
            //this.createHUD();
            //this.createscene();//simple test
            //this.initPhysics();
            //this.createscene_cube();
            //this.createplayer();
            //this.initselectObject();
            var light1 = new THREE.DirectionalLight('#fff');
            light1.position.set(-50, 50, 50);
            this.scene.add(light1);
            var light2 = new THREE.AmbientLight('#fff');
            light2.color.multiplyScalar(0.2);
            this.scene.add(light2);
            /*
            var light1 = new THREE.DirectionalLight('#fff');
            light1.position.set(-50, 50, 50);
            this.scene.add(light1);

            var light2 = new THREE.AmbientLight('#fff');
            light2.color.multiplyScalar(0.2);
            this.scene.add(light2);

            var geometry = new THREE.SphereGeometry(45, 5, 5);
            var material = new THREE.MeshPhongMaterial({
              color: '#fff',
              shading: THREE.FlatShading
            });
            var cube = new THREE.Mesh(geometry, material);
            cube.rotation.set(Math.random(), Math.random(), Math.random());
            this.scene.add(cube);
            */
            //var clearPass = new THREE.ClearPass();
            //var clearMaskPass = new THREE.ClearMaskPass();
            //var outputPass = new THREE.ShaderPass( THREE.CopyShader );
            //outputPass.renderToScreen = true;
            var copyPass = new THREE.ShaderPass(THREE.CopyShader);
            copyPass.renderToScreen = true;
            //this.createHUD();
            var renderpass1 = new THREE.RenderPass(this.scene, this.camera);
            renderpass1.renderToScreen = false;
            //this.effectComposer.addPass(render);
            //var maskPass1 = new THREE.MaskPass( this.scene, this.camera );
            var scene = new THREE.Scene();
            //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            //var material = new THREE.MeshBasicMaterial( { color: 0xccccff } );
            //var cube = new THREE.Mesh( geometry, material );
            //cube.position.x = 1;
            //scene.add( cube );
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            //var maskPass2 = new THREE.MaskPass( scene, this.camera );
            //var renderpass2 = new THREE.RenderPass(scene, camera);
            var renderpass2 = new THREE.RenderPass(scene, this.camera);
            //renderpass2.renderToScreen = false;
            //console.log(renderpass2);
            renderpass2.clear = false;
            var parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: true
            };
            //var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );
            //this.effectComposer = new THREE.EffectComposer(this.renderer,renderTarget);
            this.effectComposer = new THREE.EffectComposer(this.renderer);
            this.effectComposer.addPass(renderpass1);
            this.effectComposer.addPass(renderpass2);
            //this.effectComposer.addPass( outputPass );
            this.effectComposer.addPass(copyPass);
            //console.log(this.effectComposer);
            this.update();
        };
        Game.prototype.createHUD = function () {
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
            this.cameraHUD = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
            // Create also a custom scene for HUD.
            this.sceneHUD = new THREE.Scene();
            // Create texture from rendered graphics.
            this.hudTexture = new THREE.Texture(this.hudCanvas);
            this.hudTexture.needsUpdate = true;
            // Create HUD material.
            var material = new THREE.MeshBasicMaterial({ map: this.hudTexture });
            material.transparent = true;
            // Create plane to render the HUD. This plane fill the whole screen.
            var planeGeometry = new THREE.PlaneGeometry(width, height);
            var plane = new THREE.Mesh(planeGeometry, material);
            this.sceneHUD.add(plane);
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            //this.effectComposer.addPass(new THREE.RenderPass(this.sceneHUD, camera));
            var render = new THREE.RenderPass(this.sceneHUD, this.camera);
            render.renderToScreen = true;
            this.effectComposer.addPass(render);
        };
        Game.prototype.clearScripts = function () {
            var myNode = document.getElementById('scriptcomponents');
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            //for( var i = threejsapi_play.scene.children.length - 1; i >= 1; i--) {
            //console.log('remove item?');
            //threejsapi_play.scene.remove(threejsapi_preview.scene.children[i]);
            //}
        };
        Game.prototype.addScript = function (filename) {
            //'scriptcomponents';
            //$('scriptcomponents');
            //var head  = document.getElementsByTagName('head')[0];
            var head = document.getElementById('scriptcomponents');
            var escript = document.createElement('script');
            escript.src = filename;
            escript.type = "text/javascript";
            head.appendChild(escript);
        };
        Game.prototype.createscript = function (scriptname, args) {
            console.log('loaded script component name: ' + scriptname);
            //console.log('script');
            this.scriptcomponents[scriptname] = args;
            //console.log(this.scriptcomponents[scriptname]);
            //if(this.scriptcomponents[scriptname] != null){
            //}
        };
        Game.prototype.createComponent = function (object, name) {
            var capp;
            for (var sc in this.scriptcomponents) {
                //console.log(sc);
                if (name == sc) {
                    capp = this.scriptcomponents[sc];
                    //console.log('found!');
                    break;
                }
            }
            if (capp != null) {
                var sapp = capp(this);
                //console.log(sapp);
                object.script[name] = new sapp(object);
                //console.log(object.script[name]);
                //console.log(object);
                capp = null;
                sapp = null;
            }
            //for ( var ov in object.script[name] ){
            //console.log(typeof object.script[name][ov]);
            //console.log(ov);
            //}
            //if(object.script[name].init != null){
            //object.script[name].init();
            //}
        };
        Game.prototype.initselectObject = function () {
            var _this = this;
            this.canvas.addEventListener('mousedown', function (event) { _this.onDocumentMouseDown(event); }, false);
            //document.addEventListener( 'mousedown',(event)=>{ this.onDocumentMouseDown(event) }, false );
        };
        Game.prototype.onDocumentMouseDown = function (event) {
            event.preventDefault();
            //console.log(this);
            //()=>{
            //console.log(this);
            //};
            var mouse = new THREE.Vector2();
            var raycaster = new THREE.Raycaster();
            //mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
            //mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
            //console.log(event);
            //console.log(event.clientX);
            //console.log(this.renderer.domElement);
            //event.clientX
            //this deal with the canvas offset in editor
            mouse.x = ((event.offsetX) / this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -((event.offsetY) / this.renderer.domElement.clientHeight) * 2 + 1;
            //console.log(mouse.x);
            //console.log(event.offsetX);
            //console.log(mouse.y);
            //console.log(event.offsetY);
            raycaster.setFromCamera(mouse, this.camera);
            var intersects = raycaster.intersectObjects(this.scenenodes);
            if (intersects.length > 0) {
                console.log(intersects[0]);
                //particle.position.copy( intersects[ 0 ].point );
                //this.selectobject = intersects[0].object;
                NodeSelectObject({ object: intersects[0].object });
            }
            mouse = null;
            raycaster = null;
        };
        Game.prototype.initManger = function () {
            this.manager = new THREE.LoadingManager();
            this.manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };
        };
        Game.prototype.onProgressModel = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                //var percent = Math.round( percentComplete, 2 );
                //console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
                console.log(Math.round(percentComplete) + '% downloaded');
            }
        };
        Game.prototype.onErrorModel = function (xhr) {
            console.log(xhr);
        };
        Game.prototype.initObjectClasses = function () {
            console.log('');
        };
        Game.prototype.toolbar = function (action) {
            //console.log(action);
            if (action == 'EditorComponents:Object3D') {
                this.createshape({ shape: "Object3D" });
            }
            if (action == 'EditorComponents:Scene') {
                this.createshape({ shape: "Scene" });
            }
            if (action == 'EditorComponents:BoxGeometry') {
                this.createshape({ shape: "BoxGeometry" });
            }
            if (action == 'EditorComponents:CylinderGeometry') {
                this.createshape({ shape: "CylinderGeometry" });
            }
            if (action == 'EditorComponents:CircleGeometry') {
                this.createshape({ shape: "CircleGeometry" });
            }
            if (action == 'EditorComponents:PlaneGeometry') {
                this.createshape({ shape: "PlaneGeometry" });
            }
            if (action == 'EditorComponents:SphereGeometry') {
                this.createshape({ shape: "SphereGeometry" });
            }
            if (action == 'EditorComponents:DodecahedronGeometry') {
                this.createshape({ shape: "DodecahedronGeometry" });
            }
            if (action == 'EditorComponents:IcosahedronGeometry') {
                this.createshape({ shape: "IcosahedronGeometry" });
            }
            if (action == 'EditorComponents:OctahedronGeometry') {
                this.createshape({ shape: "OctahedronGeometry" });
            }
            if (action == 'EditorComponents:RingGeometry') {
                this.createshape({ shape: "RingGeometry" });
            }
            if (action == 'EditorComponents:TetrahedronGeometry') {
                this.createshape({ shape: "TetrahedronGeometry" });
            }
            if (action == 'EditorComponents:TorusGeometry') {
                this.createshape({ shape: "TorusGeometry" });
            }
            if (action == 'EditorComponents:TorusKnotGeometry') {
                this.createshape({ shape: "TorusKnotGeometry" });
            }
            if (action == 'EditorComponents:TextGeometry') {
                this.createshape({ shape: "TextGeometry" });
            }
            if (action == 'EditorComponents:ArrowHelper') {
                this.createshape({ shape: "ArrowHelper" });
            }
            if (action == 'EditorComponents:AxisHelper') {
                this.createshape({ shape: "AxisHelper" });
            }
            if (action == 'EditorComponents:BoundingBoxHelper') {
                this.createshape({ shape: "BoundingBoxHelper" });
            }
            if (action == 'EditorComponents:EdgesHelper') {
                this.createshape({ shape: "EdgesHelper" });
            }
            if (action == 'EditorComponents:FaceNormalsHelper') {
                this.createshape({ shape: "FaceNormalsHelper" });
            }
            if (action == 'EditorComponents:GridHelper') {
                this.createshape({ shape: "GridHelper" });
            }
            if (action == 'EditorComponents:PointLightHelper') {
                this.createshape({ shape: "PointLightHelper" });
            }
            if (action == 'EditorComponents:SpotLightHelper') {
                this.createshape({ shape: "SpotLightHelper" });
            }
            if (action == 'EditorComponents:VertexNormalsHelper') {
                this.createshape({ shape: "VertexNormalsHelper" });
            }
            if (action == 'EditorComponents:WireframeHelper') {
                this.createshape({ shape: "WireframeHelper" });
            }
            if (action == 'EditorComponents:Sprite2D') {
                this.createshape({ shape: "Sprite" });
            }
            if (action == 'EditorComponents:CubeCamera') {
                this.createObjectScene({ object: 'CubeCamera' });
            }
            if (action == 'EditorComponents:PerspectiveCamera') {
                this.createObjectScene({ object: 'PerspectiveCamera' });
            }
            if (action == 'EditorComponents:OrthographicCamera') {
                this.createObjectScene({ object: 'OrthographicCamera' });
            }
            if (action == 'EditorComponents:AmbientLight') {
                this.createObjectScene({ object: 'AmbientLight' });
            }
            if (action == 'EditorComponents:DirectionalLight') {
                this.createObjectScene({ object: 'DirectionalLight' });
            }
            if (action == 'EditorComponents:HemisphereLight') {
                this.createObjectScene({ object: 'HemisphereLight' });
            }
            if (action == 'EditorComponents:Light') {
                this.createObjectScene({ object: 'Light' });
            }
            if (action == 'EditorComponents:PointLight') {
                this.createObjectScene({ object: 'PointLight' });
            }
            if (action == 'EditorComponents:SpotLight') {
                this.createObjectScene({ object: 'SpotLight' });
            }
        };
        Game.prototype.createObjectScene = function (args) {
            if (args != null) {
                if (args['object'] != null) {
                    var objscene;
                    if (args['object'] == 'PerspectiveCamera') {
                        objscene = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
                        objscene.name = "PerspectiveCamera";
                    }
                    if (args['object'] == 'OrthographicCamera') {
                        objscene = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 10000);
                        objscene.name = "OrthographicCamera";
                    }
                    if (args['object'] == 'CubeCamera') {
                        objscene = new THREE.CubeCamera(1, 100000, 128);
                        objscene.name = "CubeCamera";
                    }
                    if (args['object'] == 'AmbientLight') {
                        objscene = new THREE.AmbientLight(0x404040); // soft white light
                        objscene.name = "AmbientLight";
                    }
                    if (args['object'] == 'DirectionalLight') {
                        objscene = new THREE.DirectionalLight(0xffffff, 0.5);
                        objscene.position.set(0, 1, 0);
                        objscene.name = "DirectionalLight";
                    }
                    if (args['object'] == 'HemisphereLight') {
                        objscene = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
                        objscene.name = "HemisphereLight";
                    }
                    if (args['object'] == 'Light') {
                        objscene = new THREE.Light(0xff0000);
                        objscene.name = "Light";
                    }
                    if (args['object'] == 'PointLight') {
                        objscene = new THREE.PointLight(0xff0000, 1, 100);
                        objscene.name = "PointLight";
                    }
                    if (args['object'] == 'SpotLight') {
                        objscene = new THREE.SpotLight(0xffffff);
                        objscene.name = "SpotLight";
                    }
                    if (objscene != null) {
                        if (this.selectobject != null) {
                            this.selectobject.add(objscene); //attach to current selected
                        }
                        else {
                            this.scene.add(objscene);
                        }
                        this.scenenodes.push(objscene);
                        console.log('create object?');
                        console.log(objscene);
                        NodeSelectObject({ object: objscene });
                        var tmpmap = this.copyobjectprops(objscene);
                        //console.log(tmpmap);
                        this.mapscenenodes.push(tmpmap);
                        //var test3d = new object3d();
                        //console.log(test3d);
                        //tmpobj = null;
                        //geometry = null;
                        //objmesh = null;
                        //edges = null;
                        //material = null;
                        RefreshContent();
                    }
                }
            }
        };
        Game.prototype.SaveJSON = function () {
            console.log('saving json...');
        };
        Game.prototype.LoadJSON = function (args) {
            if (args == null) {
                console.log('null...');
            }
            console.log(args);
            console.log('loading json...');
        };
        Game.prototype.parentObj = function (object, uuid) {
            for (var i = 0; i < this.scenenodes.length; i++) {
                if (this.scenenodes[i].uuid == uuid) {
                    this.scenenodes[i].add(object);
                    break;
                }
            }
        };
        Game.prototype.parseObject = function (strobj) {
            var tmpobj;
            var geometry;
            var objmesh;
            var edges;
            var material;
            //material = new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} );
            //material = new THREE.MeshBasicMaterial( {color: 0x156289} );
            //material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            //material = new THREE.LineBasicMaterial({
            //color: 0xffffff,
            //transparent: true,
            //opacity: 0.5
            //});
            //material = new THREE.MeshPhongMaterial({
            //color: 0x156289,
            //emissive: 0x072534,
            //side: THREE.DoubleSide,
            //shading: THREE.FlatShading
            //})
            material = new THREE.MeshPhongMaterial({
                color: 0x156289,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
            });
            var obj = JSON.parse(strobj);
            console.log(obj);
            //this.mapscenenodes.push(obj);
            if (obj.type == "Scene") {
                objmesh = new THREE.Scene();
                objmesh.uuid = obj.uuid;
                objmesh.name = obj.name;
            }
            if (obj.type == "Object3D") {
                objmesh = new THREE.Object3D();
                objmesh.uuid = obj.uuid;
                objmesh.name = obj.name;
            }
            if (obj.type == "Mesh") {
                if (obj.geometrytype == "BoxGeometry") {
                    geometry = new THREE.BoxGeometry(obj.parameters.width, obj.parameters.height, obj.parameters.depth, obj.parameters.widthSegments, obj.parameters.heightSegments, obj.parameters.depthSegments);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "CircleGeometry") {
                    geometry = new THREE.CircleGeometry(obj.parameters.radius, obj.parameters.segments, obj.parameters.thetaStart, obj.parameters.thetaLength);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "CylinderGeometry") {
                    geometry = new THREE.CylinderGeometry(obj.parameters.radiusTop, obj.parameters.radiusBottom, obj.parameters.height, obj.parameters.radiusSegments, obj.parameters.heightSegments, obj.parameters.openEnded, obj.parameters.thetaStart, obj.parameters.thetaLength);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "PlaneGeometry") {
                    geometry = new THREE.PlaneGeometry(obj.parameters.width, obj.parameters.height, obj.parameters.widthSegments, obj.parameters.heightSegments);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "PlaneGeometry") {
                    geometry = new THREE.PlaneGeometry(obj.parameters.width, obj.parameters.height, obj.parameters.widthSegments, obj.parameters.heightSegments);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "SphereGeometry") {
                    geometry = new THREE.SphereGeometry(obj.parameters.radius, obj.parameters.widthSegments, obj.parameters.heightSegments, obj.parameters.phiStart, obj.parameters.phiLength, obj.parameters.thetaStart, obj.parameters.thetaLength);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "DodecahedronGeometry") {
                    geometry = new THREE.DodecahedronGeometry(obj.parameters.radius, obj.parameters.detail);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "IcosahedronGeometry") {
                    geometry = new THREE.IcosahedronGeometry(obj.parameters.radius, obj.parameters.detail);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "OctahedronGeometry") {
                    geometry = new THREE.OctahedronGeometry(obj.parameters.radius, obj.parameters.detail);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "RingGeometry") {
                    geometry = new THREE.RingGeometry(obj.parameters.innerRadius, obj.parameters.outerRadius, obj.parameters.thetaSegments, obj.parameters.phiSegments, obj.parameters.thetaStart, obj.parameters.thetaLength);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "TetrahedronGeometry") {
                    geometry = new THREE.TetrahedronGeometry(obj.parameters.radius, obj.parameters.detail);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "TorusGeometry") {
                    geometry = new THREE.TorusGeometry(obj.parameters.radius, obj.parameters.tube, obj.parameters.radialSegments, obj.parameters.tubularSegments, obj.parameters.arc);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
                if (obj.geometrytype == "TorusKnotGeometry") {
                    geometry = new THREE.TorusKnotGeometry(obj.parameters.radius, obj.parameters.tube, obj.parameters.radialSegments, obj.parameters.tubularSegments, obj.parameters.p, obj.parameters.q, obj.parameters.heightScale);
                    objmesh = new THREE.Mesh(geometry, material);
                    objmesh.uuid = obj.uuid;
                    objmesh.name = obj.name;
                }
            }
            //check if script component exist
            if (obj.script != null) {
                if (objmesh != null) {
                    objmesh.script = {};
                    for (var os in obj.script) {
                        this.createComponent(objmesh, os);
                        for (var sv in obj.script[os]) {
                            //need make object data variable work current doesn't work
                            if (typeof obj.script[os][sv] == 'object') {
                                //console.log('OBJECT    script');
                                //console.log('obj.script'+ os+'.'+sv);
                                if (Array.isArray(obj.script[os][sv])) {
                                    console.log('found array object');
                                    objmesh.script[os][sv] = obj.script[os][sv];
                                }
                                else {
                                    if (obj.script[os][sv].type != null) {
                                        console.log('found type! :' + obj.script[os][sv].type);
                                        if (obj.script[os][sv].type == 'THREE.Vector2') {
                                            objmesh.script[os][sv] = new THREE.Vector2(obj.script[os][sv].x, obj.script[os][sv].y);
                                        }
                                        if (obj.script[os][sv].type == 'THREE.Vector3') {
                                            objmesh.script[os][sv] = new THREE.Vector3(obj.script[os][sv].x, obj.script[os][sv].y, obj.script[os][sv].z);
                                        }
                                        if (obj.script[os][sv].type == 'THREE.Vector4') {
                                            objmesh.script[os][sv] = new THREE.Vector4(obj.script[os][sv].x, obj.script[os][sv].y, obj.script[os][sv].z, obj.script[os][sv].w);
                                        }
                                        if (obj.script[os][sv].type == 'THREE.Quaternion') {
                                            objmesh.script[os][sv] = new THREE.Quaternion(obj.script[os][sv].x, obj.script[os][sv].y, obj.script[os][sv].z, obj.script[os][sv].w);
                                        }
                                    }
                                }
                            }
                            else {
                                objmesh.script[os][sv] = obj.script[os][sv]; //copy variable
                            }
                        }
                    }
                }
            }
            if (objmesh != null) {
                //console.log(obj.position);
                //console.log(parseFloat(obj.position.x),parseFloat(obj.position.y),parseFloat(obj.position.z));
                objmesh.position.set(parseFloat(obj.position.x), parseFloat(obj.position.y), parseFloat(obj.position.z));
                //console.log(obj.rotation);
                objmesh.rotation.x = parseFloat(obj.rotation._x);
                objmesh.rotation.y = parseFloat(obj.rotation._y);
                objmesh.rotation.z = parseFloat(obj.rotation._z);
                objmesh.scale.set(parseFloat(obj.scale.x), parseFloat(obj.scale.y), parseFloat(obj.scale.z));
                //objmesh.rotation = obj.rotation;
                //objmesh.scale = obj.scale;
                tmpobj = objmesh;
            }
            if (tmpobj != null) {
                this.parentObj(tmpobj, obj.parent);
                //console.log(tmpobj);
                this.scenenodes.push(tmpobj);
                //NodeSelectObject({object:tmpobj});
                var tmpmap = this.copyobjectprops(objmesh);
                //console.log("obj");
                //console.log(obj);
                //console.log("tmpmap");
                //console.log(tmpmap);
                this.mapscenenodes.push(tmpmap);
                tmpobj = null;
                geometry = null;
                objmesh = null;
                edges = null;
                material = null;
                RefreshContent();
            }
        };
        //update geom object changes
        Game.prototype.updateGroupGeometry = function (mesh, geometry) {
            //console.log("set?");
            //console.log(mesh);
            //console.log(geometry);
            mesh.geometry.dispose();
            mesh.geometry = geometry;
        };
        //check which geom type mesh to change
        Game.prototype.SetParamGeom = function (mesh) {
            if (mesh.geometry.type == "BoxGeometry") {
                this.updateGroupGeometry(mesh, new THREE.BoxGeometry(mesh.geometry.parameters.width, mesh.geometry.parameters.height, mesh.geometry.parameters.depth, mesh.geometry.parameters.widthSegments, mesh.geometry.parameters.heightSegments, mesh.geometry.parameters.depthSegments));
            }
            if (mesh.geometry.type == "CircleGeometry") {
                this.updateGroupGeometry(mesh, new THREE.CircleGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.segments, mesh.geometry.parameters.thetaStart, mesh.geometry.parameters.thetaLength));
            }
            if (mesh.geometry.type == "CylinderGeometry") {
                this.updateGroupGeometry(mesh, new THREE.CylinderGeometry(mesh.geometry.parameters.radiusTop, mesh.geometry.parameters.radiusBottom, mesh.geometry.parameters.height, mesh.geometry.parameters.radiusSegments, mesh.geometry.parameters.heightSegments, mesh.geometry.parameters.openEnded, mesh.geometry.parameters.thetaStart, mesh.geometry.parameters.thetaLength));
            }
            if (mesh.geometry.type == "PlaneGeometry") {
                this.updateGroupGeometry(mesh, new THREE.PlaneGeometry(mesh.geometry.parameters.width, mesh.geometry.parameters.height, mesh.geometry.parameters.widthSegments, mesh.geometry.parameters.heightSegments));
            }
            if (mesh.geometry.type == "SphereGeometry") {
                this.updateGroupGeometry(mesh, new THREE.SphereGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.widthSegments, mesh.geometry.parameters.heightSegments, mesh.geometry.parameters.phiStart, mesh.geometry.parameters.phiLength, mesh.geometry.parameters.thetaStart, mesh.geometry.parameters.thetaLength));
            }
            if (mesh.geometry.type == "DodecahedronGeometry") {
                this.updateGroupGeometry(mesh, new THREE.DodecahedronGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.detail));
            }
            if (mesh.geometry.type == "IcosahedronGeometry") {
                this.updateGroupGeometry(mesh, new THREE.IcosahedronGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.detail));
            }
            if (mesh.geometry.type == "OctahedronGeometry") {
                this.updateGroupGeometry(mesh, new THREE.OctahedronGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.detail));
            }
            if (mesh.geometry.type == "RingGeometry") {
                this.updateGroupGeometry(mesh, new THREE.RingGeometry(mesh.geometry.parameters.innerRadius, mesh.geometry.parameters.outerRadius, mesh.geometry.parameters.thetaSegments, mesh.geometry.parameters.phiSegments, mesh.geometry.parameters.thetaStart, mesh.geometry.parameters.thetaLength));
            }
            if (mesh.geometry.type == "TetrahedronGeometry") {
                this.updateGroupGeometry(mesh, new THREE.TetrahedronGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.detail));
            }
            if (mesh.geometry.type == "TorusGeometry") {
                this.updateGroupGeometry(mesh, new THREE.TorusGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.tube, mesh.geometry.parameters.radialSegments, mesh.geometry.parameters.tubularSegments, mesh.geometry.parameters.arc));
            }
            if (mesh.geometry.type == "TorusKnotGeometry") {
                this.updateGroupGeometry(mesh, new THREE.TorusKnotGeometry(mesh.geometry.parameters.radius, mesh.geometry.parameters.tube, mesh.geometry.parameters.radialSegments, mesh.geometry.parameters.tubularSegments, mesh.geometry.parameters.p, mesh.geometry.parameters.q, mesh.geometry.parameters.heightScale));
            }
        };
        Game.prototype.copyobjectprops = function (obj) {
            console.log('//  = processing ');
            var o3d = new object3d();
            o3d.uuid = obj.uuid;
            o3d.name = obj.name;
            o3d.type = obj.type;
            if (obj.parent != null) {
                o3d.parent = obj.parent.uuid;
            }
            else {
                o3d.parent = null;
            }
            o3d.children = [];
            if (obj.geometry != null) {
                o3d.geometrytype = obj.geometry.type;
                if (obj.geometry.parameters != null) {
                    o3d.parameters = obj.geometry.parameters;
                }
            }
            if (obj.script != null) {
                /*
                var is_array = function (value) {
                    return value &&
                    typeof value === 'object' &&
                    typeof value.length === 'number' &&
                    typeof value.splice === 'function' &&
                    !(value.propertyIsEnumerable('length'));
                };
                */
                o3d.script = {}; //create script object
                for (var os in obj.script) {
                    o3d.script[os] = {}; //create object
                    for (var param in obj.script[os]) {
                        //console.log(typeof obj.script[os][param]);
                        //console.log(obj.script[os][param]);
                        if ((typeof obj.script[os][param] == 'object')) {
                            if (param != 'entity') {
                                console.log('checking object type?');
                                console.log('obj.script.' + os + '.' + '' + param);
                                if (obj.script[os][param] instanceof THREE.Object3D) {
                                    if (obj.script[os][param].type == 'Object3D') {
                                        console.log(obj.script[os][param]);
                                        console.log('found Object3D!');
                                        //o3d.script[os][param] = obj.script[os][param]; // error on geometry uuid if not set
                                        o3d.script[os][param] = { type: 'Object3D', uuid: obj.script[os][param].uuid };
                                    }
                                }
                                if (obj.script[os][param] instanceof THREE.Mesh) {
                                    console.log(obj.script[os][param]);
                                    console.log('found Mesh!');
                                    //o3d.script[os][param] = obj.script[os][param]; // error on geometry uuid if not set
                                    o3d.script[os][param] = { type: 'Mesh', uuid: obj.script[os][param].uuid };
                                }
                                if (Object.prototype.toString.call(obj.script[os][param]) === '[object Array]') {
                                    console.log(obj.script[os][param]);
                                    console.log('found object Array!');
                                    o3d.script[os][param] = obj.script[os][param];
                                }
                                if (obj.script[os][param] instanceof THREE.Vector2) {
                                    console.log(obj.script[os][param]);
                                    console.log('found THREE.Vector2!');
                                    o3d.script[os][param] = obj.script[os][param];
                                    o3d.script[os][param] = { type: 'THREE.Vector2', x: obj.script[os][param].x, y: obj.script[os][param].y };
                                }
                                if (obj.script[os][param] instanceof THREE.Vector3) {
                                    console.log(obj.script[os][param]);
                                    console.log('found THREE.Vector3!');
                                    //o3d.script[os][param] = obj.script[os][param];
                                    o3d.script[os][param] = { type: 'THREE.Vector3', x: obj.script[os][param].x, y: obj.script[os][param].y, z: obj.script[os][param].z };
                                }
                                if (obj.script[os][param] instanceof THREE.Vector4) {
                                    console.log(obj.script[os][param]);
                                    console.log('found THREE.Vector4!');
                                    //o3d.script[os][param] = obj.script[os][param];
                                    o3d.script[os][param] = { type: 'THREE.Vector4', x: obj.script[os][param].x, y: obj.script[os][param].y, z: obj.script[os][param].z, w: obj.script[os][param].w };
                                }
                                if (obj.script[os][param] instanceof THREE.Quaternion) {
                                    console.log(obj.script[os][param]);
                                    console.log('found THREE.Quaternion!');
                                    //o3d.script[os][param] = obj.script[os][param];
                                    o3d.script[os][param] = { type: 'THREE.Quaternion', x: obj.script[os][param].x, y: obj.script[os][param].y, z: obj.script[os][param].z, w: obj.script[os][param].w };
                                }
                            }
                        }
                        if ((typeof obj.script[os][param] == 'string')) {
                            o3d.script[os][param] = obj.script[os][param]; //assign var
                        }
                        if ((typeof obj.script[os][param] == 'string')) {
                            o3d.script[os][param] = obj.script[os][param]; //assign var
                        }
                        if ((typeof obj.script[os][param] == 'boolean')) {
                            o3d.script[os][param] = obj.script[os][param]; //assign var
                        }
                        if ((typeof obj.script[os][param] == 'number')) {
                            o3d.script[os][param] = obj.script[os][param]; //assign var
                        }
                    }
                }
            }
            o3d.position = obj.position;
            o3d.rotation = obj.rotation;
            o3d.scale = obj.scale;
            return o3d;
        };
        Game.prototype.createshape = function (args) {
            if (args != null) {
                if (args['shape'] != null) {
                    var tmpobj;
                    var geometry;
                    var objmesh;
                    var edges;
                    var material;
                    var tmpmap;
                    if (args['shape'] == 'Scene') {
                        objmesh = new THREE.Scene();
                        objmesh.name = "Scene";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'Sprite') {
                        //var map = new THREE.TextureLoader().load( "sprite.png" );
                        //var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
                        material = new THREE.SpriteMaterial({ color: 0xffffff, fog: true });
                        objmesh = new THREE.Sprite(material);
                        objmesh.name = 'Sprite';
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'Object3D') {
                        //console.log('object 3d??');
                        objmesh = new THREE.Object3D();
                        objmesh.name = 'Object3D';
                        //console.log(objmesh);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'BoxGeometry') {
                        geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
                        material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "BoxGeometry";
                        console.log(objmesh);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'CircleGeometry') {
                        geometry = new THREE.CircleGeometry(2, 8, 0, 2 * Math.PI);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "CircleGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'CylinderGeometry') {
                        geometry = new THREE.CylinderGeometry(5, 5, 10, 8, 1, false, 0, 2 * Math.PI);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "CylinderGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'PlaneGeometry') {
                        geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "PlaneGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'SphereGeometry') {
                        geometry = new THREE.SphereGeometry(5, 32, 32, 0, 2 * Math.PI, 0, 2 * Math.PI);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "SphereGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'DodecahedronGeometry') {
                        geometry = new THREE.DodecahedronGeometry(1, 0);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "DodecahedronGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'IcosahedronGeometry') {
                        geometry = new THREE.IcosahedronGeometry(1, 0);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "IcosahedronGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'OctahedronGeometry') {
                        geometry = new THREE.OctahedronGeometry(1, 0);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "OctahedronGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'RingGeometry') {
                        geometry = new THREE.RingGeometry(1, 5, 8, 1, 0, 2 * Math.PI);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "RingGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'TetrahedronGeometry') {
                        geometry = new THREE.TetrahedronGeometry(1, 0);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "TetrahedronGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'TorusGeometry') {
                        geometry = new THREE.TorusGeometry(10, 3, 16, 100, 2 * Math.PI);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "TorusGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'TorusKnotGeometry') {
                        geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16, 2, 3, 1);
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "TorusKnotGeometry";
                        console.log(objmesh.geometry.parameters);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'TextGeometry') {
                        geometry = new THREE.TextGeometry('Text', {});
                        material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "TextGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'ArrowHelper') {
                        var dir = new THREE.Vector3(1, 0, 0);
                        var origin = new THREE.Vector3(0, 0, 0);
                        var length = 1;
                        var hex = 0xffff00;
                        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
                        tmpobj = arrowHelper;
                    }
                    if (args['shape'] == 'AxisHelper') {
                        var axisHelper = new THREE.AxisHelper(5);
                        tmpobj = axisHelper;
                    }
                    if (args['shape'] == 'BoundingBoxHelper') {
                        objmesh = new THREE.Object3D();
                        var hex = 0xff0000;
                        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                        var sphere = new THREE.Mesh(new THREE.SphereGeometry(30, 12, 12), sphereMaterial);
                        objmesh.add(sphere);
                        var bbox = new THREE.BoundingBoxHelper(sphere, hex);
                        bbox.update();
                        objmesh.add(bbox);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'EdgesHelper') {
                        objmesh = new THREE.Object3D();
                        geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        edges = new THREE.EdgesHelper(object, 0x00ff00);
                        objmesh.add(object);
                        objmesh.add(edges);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'FaceNormalsHelper') {
                        objmesh = new THREE.Object3D();
                        geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        edges = new THREE.FaceNormalsHelper(object, 2, 0x00ff00, 1);
                        objmesh.add(object);
                        objmesh.add(edges);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'GridHelper') {
                        var size = 10;
                        var step = 1;
                        var gridHelper = new THREE.GridHelper(size, step);
                        tmpobj = gridHelper;
                    }
                    if (args['shape'] == 'PointLightHelper') {
                        objmesh = new THREE.Object3D();
                        var pointLight = new THREE.PointLight(0xff0000, 1, 100);
                        pointLight.position.set(10, 10, 10);
                        objmesh.add(pointLight);
                        var sphereSize = 1;
                        var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
                        objmesh.add(pointLightHelper);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'SpotLightHelper') {
                        objmesh = new THREE.Object3D();
                        var spotLight = new THREE.SpotLight(0xffffff);
                        spotLight.position.set(10, 10, 10);
                        objmesh.add(spotLight);
                        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
                        objmesh.add(spotLightHelper);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'VertexNormalsHelper') {
                        objmesh = new THREE.Object3D();
                        geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        edges = new THREE.VertexNormalsHelper(object, 2, 0x00ff00, 1);
                        objmesh.add(object);
                        objmesh.add(edges);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'WireframeHelper') {
                        objmesh = new THREE.Object3D();
                        geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        var wireframe = new THREE.WireframeHelper(object, 0x00ff00);
                        objmesh.add(object);
                        objmesh.add(wireframe);
                        tmpobj = objmesh;
                    }
                    if (tmpobj != null) {
                        if (this.selectobject != null) {
                            this.selectobject.add(tmpobj); //attach to current selected
                        }
                        else {
                            this.scene.add(tmpobj);
                        }
                        this.scenenodes.push(tmpobj);
                        console.log('create object?');
                        console.log(tmpobj);
                        NodeSelectObject({ object: tmpobj });
                        tmpmap = this.copyobjectprops(objmesh);
                        //console.log(tmpmap);
                        this.mapscenenodes.push(tmpmap);
                        //var test3d = new object3d();
                        //console.log(test3d);
                        tmpobj = null;
                        geometry = null;
                        objmesh = null;
                        edges = null;
                        material = null;
                        RefreshContent();
                    }
                }
            }
        };
        Game.prototype.createplayer = function (arg) {
            var player = function () {
                THREE.Object3D.apply(this);
                //this.type = 'custom';
                //this.hashid = "0";
                this.name = "none";
                return this;
            };
            player.prototype = Object.create(THREE.Object3D.prototype);
            //player.prototype.constructor = player;
            player.prototype.init = function () {
            };
            player.prototype.update = function (delta) {
                //console.log("update?");
            };
            var tplayer = new player();
            this.scene.add(tplayer);
            console.log(tplayer);
            return tplayer;
        };
        Game.prototype.createcharacter = function () {
            console.log('');
        };
        Game.prototype.getext = function (filename) {
            return filename.substr(filename.lastIndexOf('.'));
        };
        Game.prototype.LoadFile = function (filename) {
            var _this = this;
            console.log('file: ' + filename);
            if (this.getext(filename) == '.fbx') {
                this.LoadFBX(filename, function (object) {
                    _this.scene.add(object);
                });
            }
            if (this.getext(filename) == '.dae') {
                this.LoadDAE(filename, function (object) {
                    _this.scene.add(object);
                });
            }
            if (this.getext(filename) == '.obj') {
                this.LoadOBJ(filename, function (object) {
                    _this.scene.add(object);
                });
            }
            if (this.getext(filename) == '.js') {
                this.LoadJSONObj(filename);
            }
        };
        Game.prototype.LoadJSONObj = function (filename) {
            var filepath = "/assets/" + filename;
            var loader = new THREE.JSONLoader();
            var self = this;
            var name = filename;
            loader.load(filepath, function (geometry, materials) {
                var material = materials[0];
                material.morphTargets = true;
                material.color.setHex(0xffaaaa);
                var faceMaterial = new THREE.MultiMaterial(materials);
                var mesh = new THREE.Mesh(geometry, faceMaterial);
                mesh.name = name;
                self.scene.add(mesh);
                name = null;
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadFBX = function (filename, callback) {
            var filepath = "/assets/" + filename;
            var name = filename;
            console.log(filepath);
            var loader = new THREE.FBXLoader(this.manager);
            var self = this;
            loader.load(filepath, function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                    }
                    if (child instanceof THREE.SkinnedMesh) {
                        if (child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined) {
                            child.mixer = new THREE.AnimationMixer(child);
                            //mixers.push( child.mixer );
                            var action = child.mixer.clipAction(child.geometry.animations[0]);
                            action.play();
                        }
                    }
                });
                //self.scene.add( object );
                object.name = name;
                callback(object);
                name = null;
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadDAE = function (filename, callback) {
            var loader = new THREE.ColladaLoader(this.manager);
            var name = filename;
            var self = this;
            loader.options.convertUpAxis = true;
            var filepath = "/assets/" + filename;
            loader.load(filepath, function (collada) {
                var dae = collada.scene;
                dae.traverse(function (child) {
                    if (child instanceof THREE.SkinnedMesh) {
                        var animation = new THREE.Animation(child, child.geometry.animation);
                        animation.play();
                    }
                });
                //dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
                dae.updateMatrix();
                //init();
                //animate();
                //self.scene.add( dae );
                dae.name = name;
                callback(dae);
                console.log("added");
                name = null;
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadOBJ = function (filename, callback) {
            var self = this;
            var name = filename;
            var filepath = "/assets/" + filename;
            var loader = new THREE.OBJLoader(this.manager);
            //var loader = new THREE.OBJLoader();
            loader.load(filepath, function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                    }
                });
                //object.position.y = - 95;
                //self.scene.add( object );
                object.name = name;
                callback(object);
                name = null;
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.initPhysics = function () {
            if (this.setPhysicsType[this.physicsIndex] == 'Oimo.js') {
                this.initOimoPhysics();
            }
            if (this.setPhysicsType[this.physicsIndex] == 'Cannon.js') {
                this.initCannonPhysics();
            }
            if (this.setPhysicsType[this.physicsIndex] == 'Ammo.js') {
                this.initAmmoPhysics();
            }
        };
        Game.prototype.basicTexture = function (n) {
            var canvas = document.createElement('canvas');
            canvas.width = canvas.height = 64;
            var ctx = canvas.getContext('2d');
            var colors = [];
            if (n === 0) {
                colors[0] = "#58AA80";
                colors[1] = "#58FFAA";
            }
            if (n === 1) {
                colors[0] = "#383838";
                colors[1] = "#38AA80";
            }
            if (n === 2) {
                colors[0] = "#AA8058";
                colors[1] = "#FFAA58";
            }
            if (n === 3) {
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
        };
        Game.prototype.createTexMat = function () {
            // background
            var buffgeoBack = new THREE.BufferGeometry();
            buffgeoBack.fromGeometry(new THREE.IcosahedronGeometry(8000, 1));
            var back = new THREE.Mesh(buffgeoBack, new THREE.MeshBasicMaterial({ map: this.gradTexture([[1, 0.75, 0.5, 0.25], ['#1B1D1E', '#3D4143', '#72797D', '#b0babf']]), side: THREE.BackSide, depthWrite: false }));
            back.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(15 * this.ToRad));
            back.name = "skybox";
            this.scene.add(back);
        };
        Game.prototype.gradTexture = function (color) {
            var c = document.createElement("canvas");
            var ct = c.getContext("2d");
            c.width = 16;
            c.height = 256;
            var gradient = ct.createLinearGradient(0, 0, 0, 256);
            var i = color[0].length;
            while (i--) {
                gradient.addColorStop(color[0][i], color[1][i]);
            }
            ct.fillStyle = gradient;
            ct.fillRect(0, 0, 16, 256);
            var texture = new THREE.Texture(c);
            texture.needsUpdate = true;
            return texture;
        };
        Game.prototype.addStaticBox = function (size, position, rotation, spec) {
            //console.log(this.buffgeoBox);
            var mesh;
            if (spec)
                mesh = new THREE.Mesh(this.buffgeoBox, this.matGroundTrans);
            else
                mesh = new THREE.Mesh(this.buffgeoBox, this.matGround);
            mesh.scale.set(size[0], size[1], size[2]);
            mesh.position.set(position[0], position[1], position[2]);
            mesh.rotation.set(rotation[0] * this.ToRad, rotation[1] * this.ToRad, rotation[2] * this.ToRad);
            this.scene.add(mesh);
            this.grounds.push(mesh);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        };
        // Cannon
        Game.prototype.initCannonPhysics = function () {
            if (typeof CANNON != undefined) {
                this.world = new CANNON.World();
                this.world.gravity.set(0, -9.82, 0);
                this.world.broadphase = new CANNON.NaiveBroadphase();
                this.world.solver.iterations = 10;
            }
            this.createCannonScene();
        };
        Game.prototype.createCannonScene = function () {
            //var groundShape = new CANNON.Plane();
            //var groundBody = new CANNON.Body({ mass: 0 });
            //groundBody.addShape(groundShape);
            //groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
            //this.world.add(groundBody);
            //var ground = this.world.add({name:"ground",size:[400, 40, 400], pos:[0,-20,0], config:config});
            //this.addStaticBox( [400, 40, 400], [0,-20,0], [0,0,0], false);
            var boxShape1 = new CANNON.Box(new CANNON.Vec3(200, 20, 200)); //half extend
            var boxBody1 = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, -20, 0) });
            boxBody1.addShape(boxShape1);
            this.world.add(boxBody1);
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var boxShape2 = new CANNON.Box(new CANNON.Vec3(100, 15, 195)); //half extend
            console.log(-Math.PI / 2);
            var boxBody2 = new CANNON.Body({ mass: 0 });
            boxBody2.addShape(boxShape2);
            boxBody2.position = new CANNON.Vec3(130, 40, 0);
            boxBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), (30 * Math.PI / 180));
            //boxBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),(0.5235987756));
            console.log(boxBody2.quaternion);
            this.world.add(boxBody2);
            //var geometry = new THREE.BoxGeometry( 200, 30, 390 );
            //var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
            //var cube = this.cube = new THREE.Mesh( geometry, material );
            //cube.quaternion.copy(boxBody2.quaternion);
            //cube.position.copy(boxBody2.position);
            //this.scene.add( cube );
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            var mass = 5, radius = 2;
            var sphereShape = new CANNON.Sphere(radius); // Step 1
            var sphereBody = new CANNON.Body({ mass: mass }); // Step 2
            sphereBody.addShape(sphereShape);
            //sphereBody.position.set(0,100,0);
            //sphereBody.angularVelocity.set(0,10,0);
            sphereBody.angularDamping = 0.5;
            sphereBody.addEventListener("collide", function (e) { console.log("sphere collided"); });
            this.bodies[0] = sphereBody;
            var x = 150;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            sphereBody.position.set(x, y, z);
            this.world.add(sphereBody); // Step 3
            //console.log(sphereBody);
            var buffgeoSphere = new THREE.BufferGeometry();
            buffgeoSphere.fromGeometry(new THREE.SphereGeometry(2, 20, 10));
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            this.scene.add(this.meshs[0]);
            //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
            //var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
            //var cube = this.cube = new THREE.Mesh( geometry, material );
            //this.scene.add( cube );
            //this.meshs[0] = cube;
        };
        Game.prototype.updateCannonPhysics = function () {
            if (typeof CANNON != undefined) {
                //var timeStep = 1.0 / 60.0; // seconds
                //this.world.step(timeStep);
                //timeStep = null;
                //world.gravity.set(0,0,-9.82);
                this.world.step(this.timeSteptimeStep);
                //https://github.com/schteppe/cannon.js/issues/188
                //var result = [];
                //this.world.narrowphase.getContacts([bodyA], [bodyB], this.world, result, [], [], []);
                //var overlaps = result.length > 0;
                for (var i = 0; i < this.bodies.length; i++) {
                    var mesh = this.meshs[i];
                    var body = this.bodies[i];
                    //console.log(body.sleeping);
                    //if(!body.sleeping){
                    //console.log(body.position);
                    mesh.position.copy(body.position);
                    //console.log(mesh.position);
                    mesh.quaternion.copy(body.quaternion);
                }
            }
        };
        Game.prototype.destroyCannonPhysics = function () {
            console.log('destroyCannonPhysics');
        };
        // Ammo
        Game.prototype.initAmmoPhysics = function () {
            //https://github.com/kripken/ammo.js/blob/master/examples/hello_world.js
            if (typeof Ammo != undefined) {
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
        };
        Game.prototype.createAmmoScene = function () {
            //this.camera.position.set( 0, 50, 50 );
            //this.controls.target.set(0, 0, 0);
            //this.controls.update();
            //ground
            var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200)); //half extent
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
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var groundShape2 = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200)); //half extent
            var groundTransform2 = new Ammo.btTransform();
            groundTransform2.setIdentity();
            groundTransform2.setOrigin(new Ammo.btVector3(130, 40, 0));
            var q = new Ammo.btQuaternion(0, 0, 0.25881904510252074, 0.9659258262890683);
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
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            var x = 150;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            //sphere
            var colShape = new Ammo.btSphereShape(1);
            var startTransform = new Ammo.btTransform();
            startTransform.setIdentity();
            var mass = 1;
            var isDynamic = (mass != 0);
            var localInertia = new Ammo.btVector3(0, 0, 0);
            if (isDynamic)
                colShape.calculateLocalInertia(mass, localInertia);
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
            buffgeoSphere.fromGeometry(new THREE.SphereGeometry(1, 20, 10));
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            this.scene.add(this.meshs[0]);
            //var geometry = new THREE.BoxGeometry( 2, 2, 2 );
            //var material = new THREE.MeshBasicMaterial( { color: 0xcccccc } );
            //var cube = this.cube = new THREE.Mesh( geometry, material );
            //cube.position.y = 5;
            //this.scene.add( cube );
            //this.meshs[0] = cube;
        };
        Game.prototype.updateAmmoPhysics = function () {
            if (typeof Ammo != undefined) {
                this.world.stepSimulation(1 / 60, 10);
                var i, dp = this.dp, num = dp.getNumManifolds(), manifold, num_contacts, j, pt;
                for (i = 0; i < num; i++) {
                    manifold = dp.getManifoldByIndexInternal(i);
                    num_contacts = manifold.getNumContacts();
                    if (num_contacts === 0) {
                        continue;
                    }
                    for (j = 0; j < num_contacts; j++) {
                        pt = manifold.getContactPoint(j);
                    }
                }
                for (var ii = 0; ii < this.bodies.length; ii++) {
                    var mesh = this.meshs[ii];
                    var body = this.bodies[ii];
                    //console.log(body.sleeping);
                    if (body.getMotionState()) {
                        body.getMotionState().getWorldTransform(this.trans);
                        //console.log("world pos = " + [this.trans.getOrigin().x().toFixed(2), this.trans.getOrigin().y().toFixed(2), this.trans.getOrigin().z().toFixed(2)]);
                        mesh.position.set(this.trans.getOrigin().x().toFixed(2), this.trans.getOrigin().y().toFixed(2), this.trans.getOrigin().z().toFixed(2));
                        mesh.rotation.set(this.trans.getRotation().x().toFixed(2), this.trans.getRotation().y().toFixed(2), this.trans.getRotation().z().toFixed(2), this.trans.getRotation().w().toFixed(2));
                    }
                }
            }
        };
        Game.prototype.destroyAmmoPhysics = function () {
            //https://github.com/kripken/ammo.js/blob/master/examples/hello_world.js
            // Delete objects we created through |new|. We just do a few of them here, but you should do them all if you are not shutting down ammo.js
            Ammo.destroy(this.collisionConfiguration);
            Ammo.destroy(this.dispatcher);
            Ammo.destroy(this.overlappingPairCache);
            Ammo.destroy(this.solver);
        };
        // Oimo
        Game.prototype.initOimoPhysics = function () {
            if (typeof OIMO != undefined) {
                this.world = new OIMO.World(1 / 60, 2);
                //this.world.gravity = new OIMO.Vec3(0, -1, 0);
                this.world.clear();
                this.createOimoScene();
                this.infos = document.getElementById("info");
            }
        };
        Game.prototype.createOimoScene = function () {
            console.log('init oimo.js');
            // The Bit of a collision group
            var group1 = 1 << 0; // 00000000 00000000 00000000 00000001
            var group2 = 1 << 1; // 00000000 00000000 00000000 00000010
            var group3 = 1 << 2; // 00000000 00000000 00000000 00000100
            var all = 0xffffffff; // 11111111 11111111 11111111 11111111
            // Is all the physics setting for rigidbody
            var config = [
                1,
                0.4,
                0.2,
                1,
                0xffffffff // The bits of the collision groups with which the shape collides.
            ];
            //add ground
            var ground = this.world.add({ name: "ground", size: [400, 40, 400], pos: [0, -20, 0], config: config });
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var ground2 = this.world.add({ name: "ground2", size: [200, 30, 390], pos: [130, 40, 0], rot: [0, 0, 32], config: config });
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            config[3] = group1;
            config[4] = all & ~group2; // all exepte groupe2
            var ground3 = this.world.add({ name: "ground3", size: [5, 100, 390], pos: [0, 40, 0], rot: [0, 0, 0], config: config });
            this.addStaticBox([5, 100, 390], [0, 40, 0], [0, 0, 0], true);
            var x = 150;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            var w = 10 + Math.random() * 10;
            var h = 10 + Math.random() * 10;
            var d = 10 + Math.random() * 10;
            var buffgeoSphere = new THREE.BufferGeometry();
            buffgeoSphere.fromGeometry(new THREE.SphereGeometry(1, 20, 10));
            config[4] = all;
            config[3] = group2; //
            this.bodies[0] = this.world.add({ type: 'sphere', size: [w * 0.5], pos: [x, y, z], move: true, config: config });
            this.bodies[0].name = "sphere";
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            //console.log(this.world);
            //console.log(this.bodies[0]);
            //this.bodies[0].addEventListener("collide", function(e){ console.log("sphere collided"); } );//nope
            //this.bodies[0].on('collision',()=>{});
            //console.log(this.meshs[0]);
            this.meshs[0].scale.set(w * 0.5, w * 0.5, w * 0.5);
            this.scene.add(this.meshs[0]);
        };
        Game.prototype.updateOimoPhysics = function () {
            //https://github.com/lo-th/Oimo.js/blob/gh-pages/test_moving.html
            if ((typeof this.world == 'undefined') || (this.world == null)) {
                return;
            }
            this.world.step();
            this.infos.innerHTML = this.world.performance.show();
            // contact test
            if (this.world.checkContact('ground', 'sphere')) {
            }
            if (this.world.checkContact('ground2', 'sphere')) {
            }
            if (this.world.checkContact('ground3', 'sphere')) {
            }
            for (var i = 0; i < this.bodies.length; i++) {
                var mesh = this.meshs[i];
                var body = this.bodies[i];
                if (!body.sleeping) {
                    mesh.position.copy(body.getPosition());
                    //console.log(mesh.position);
                    mesh.quaternion.copy(body.getQuaternion());
                    //console.log(body.numContacts);
                    if (body.numContacts > 0) {
                    }
                    if (mesh.position.y < -100) {
                        var x = 150;
                        var z = -100 + Math.random() * 200;
                        var y = 100 + Math.random() * 1000;
                        body.resetPosition(x, y, z);
                    }
                }
            }
        };
        Game.prototype.destroyOimoPhysics = function () {
            console.log('destroyOimoPhysics');
        };
        Game.prototype.createscene_cube = function () {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
            var cube = this.cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            //this.camera.position.z = 5;
        };
        Game.prototype.createscene = function () {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
            var cube = this.cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            this.camera.position.z = 5;
        };
        Game.prototype.createscene_sample = function () {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            var cube = this.cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            this.camera.position.z = 5;
        };
        Game.prototype.updatePhysics = function () {
            if (this.world == null) {
                return;
            }
            if (this.setPhysicsType[this.physicsIndex] == 'Oimo.js') {
                this.updateOimoPhysics();
            }
            if (this.setPhysicsType[this.physicsIndex] == 'Cannon.js') {
                this.updateCannonPhysics();
            }
            if (this.setPhysicsType[this.physicsIndex] == 'Ammo.js') {
                this.updateAmmoPhysics();
            }
        };
        //update scene and physics
        Game.prototype.update = function () {
            var _this = this;
            requestAnimationFrame(function () { _this.update(); });
            var width = window.innerWidth;
            var height = window.innerHeight;
            if (this.cube != null) {
                this.cube.rotation.x += 0.1;
                this.cube.rotation.y += 0.1;
            }
            //custom update function check
            if (this.scene != null) {
                if (this.bupdateobjects == true) {
                    this.scene.traverse(function (object) {
                        if (typeof object.update != 'undefined') {
                            object.update();
                        }
                        if (typeof object.script != 'undefined') {
                            for (var obs in object.script) {
                                if (object.script[obs].update != null) {
                                    object.script[obs].update();
                                }
                            }
                        }
                    });
                }
            }
            //this.effectComposer.render(0.05);
            this.effectComposer.render();
            //console.log(this.effectComposer);
            //console.log('render?');
            // Render scene.
            //this.renderer.render(this.scene, this.camera);
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
        };
        return Game;
    }());
    ThreejsAPI.Game = Game;
    function object3d() {
        this.uuid = "";
        this.name = "";
        return this;
    }
    ThreejsAPI.object3d = object3d;
})(ThreejsAPI || (ThreejsAPI = {}));
//var threejsapi = new ThreejsAPI.Game();
//console.log(app);
