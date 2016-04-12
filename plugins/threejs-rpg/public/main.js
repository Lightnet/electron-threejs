var ThreejsAPI;
(function (ThreejsAPI) {
    var Game = (function () {
        function Game(args) {
            var _this = this;
            this.antialias = true;
            this.bablenetwork = false;
            this.materialType = 'MeshBasicMaterial';
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
            this.meshs = [];
            this.bodies = [];
            this.grounds = [];
            this.customscript = [];
            this.scriptlist = [];
            this.loadedscript = [];
            this.ToRad = 0.0174532925199432957;
            this.timeSteptimeStep = 1 / 60;
            if (args != null) {
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
        }
        Game.prototype.addListener = function (event, obj, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(event, fn, false);
            }
            else {
                obj.attachEvent("on" + event, fn);
            }
        };
        Game.prototype.init = function () {
            console.log("init threejs engine");
            this.initManger();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            this.camera.name = "camera";
            this.camera.position.set(0, 0, 10);
            this.scenenodes.push(this.camera);
            this.scene = new THREE.Scene();
            this.scene.name = "scene";
            this.scenenodes.push(this.scene);
            this.scene.add(this.camera);
            this.canvas = document.getElementById('myCanvas');
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, precision: "mediump", antialias: this.antialias });
            if (this.brenderersize) {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            }
            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFShadowMap;
            if (this.bcanvasRatio == true) {
                var winResize = new THREEx.WindowResize(this.renderer, this.camera);
            }
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.target.set(0, 0, 0);
            this.controls.update();
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
            this.createTexMat();
            this.createscene_cube();
            var copyPass = new THREE.ShaderPass(THREE.CopyShader);
            copyPass.renderToScreen = true;
            var renderpass1 = new THREE.RenderPass(this.scene, this.camera);
            renderpass1.renderToScreen = false;
            var scene = new THREE.Scene();
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var material = new THREE.MeshBasicMaterial({ color: 0xccccff });
            var cube = new THREE.Mesh(geometry, material);
            cube.position.x = 1;
            scene.add(cube);
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            var renderpass2 = new THREE.RenderPass(scene, this.camera);
            console.log(renderpass2);
            renderpass2.clear = false;
            var parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                stencilBuffer: true
            };
            this.effectComposer = new THREE.EffectComposer(this.renderer);
            this.effectComposer.addPass(renderpass1);
            this.effectComposer.addPass(renderpass2);
            this.effectComposer.addPass(copyPass);
            console.log(this.effectComposer);
            this.update();
        };
        Game.prototype.createHUD = function () {
            this.hudCanvas = document.createElement('canvas');
            var width = window.innerWidth;
            var height = window.innerHeight;
            this.hudCanvas.width = window.innerWidth;
            this.hudCanvas.height = window.innerHeight;
            this.hudBitmap = this.hudCanvas.getContext('2d');
            this.hudBitmap.font = "Normal 40px Arial";
            this.hudBitmap.textAlign = 'center';
            this.hudBitmap.fillStyle = "rgba(245,245,245,0.75)";
            this.hudBitmap.fillText('Initializing...', width / 2, height / 2);
            this.cameraHUD = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
            this.sceneHUD = new THREE.Scene();
            this.hudTexture = new THREE.Texture(this.hudCanvas);
            this.hudTexture.needsUpdate = true;
            var material = new THREE.MeshBasicMaterial({ map: this.hudTexture });
            material.transparent = true;
            var planeGeometry = new THREE.PlaneGeometry(width, height);
            var plane = new THREE.Mesh(planeGeometry, material);
            this.sceneHUD.add(plane);
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
            var render = new THREE.RenderPass(this.sceneHUD, this.camera);
            render.renderToScreen = true;
            this.effectComposer.addPass(render);
        };
        Game.prototype.createscript = function (scriptname, args) {
        };
        Game.prototype.initselectObject = function () {
            var _this = this;
            this.canvas.addEventListener('mousedown', function (event) { _this.onDocumentMouseDown(event); }, false);
        };
        Game.prototype.onDocumentMouseDown = function (event) {
            event.preventDefault();
            var mouse = new THREE.Vector2();
            var raycaster = new THREE.Raycaster();
            mouse.x = ((event.offsetX) / this.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -((event.offsetY) / this.renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            var intersects = raycaster.intersectObjects(this.scenenodes);
            if (intersects.length > 0) {
                console.log(intersects[0]);
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
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };
        Game.prototype.onErrorModel = function (xhr) {
            console.log(xhr);
        };
        Game.prototype.initObjectClasses = function () {
            console.log('');
        };
        Game.prototype.toolbar = function (action) {
            console.log(action);
            if (action == 'EditorComponents:BoxGeometry') {
                this.createshape({ shape: "BoxGeometry" });
            }
            if (action == 'EditorComponents:Object3D') {
                this.createshape({ shape: "Object3D" });
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
        Game.prototype.createshape = function (args) {
            if (args != null) {
                if (args['shape'] != null) {
                    var tmpobj;
                    if (args['shape'] == 'BoxGeometry') {
                        var geometry = new THREE.BoxGeometry(1, 1, 1);
                        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        var objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "BoxGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'Object3D') {
                        tmpobj = new THREE.Object3D();
                        tmpobj.name = 'Object3D';
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'CylinderGeometry') {
                        var geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
                        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        var objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "CylinderGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'CylinderGeometry') {
                        var geometry = new THREE.CircleGeometry(5, 12);
                        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                        var objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "CylinderGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'PlaneGeometry') {
                        var geometry = new THREE.PlaneGeometry(5, 20, 32);
                        var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                        var objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "PlaneGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'SphereGeometry') {
                        var geometry = new THREE.SphereGeometry(5, 32, 32);
                        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        var objmesh = new THREE.Mesh(geometry, material);
                        objmesh.name = "SphereGeometry";
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'TextGeometry') {
                        var geometry = new THREE.TextGeometry('Text', {});
                        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                        var objmesh = new THREE.Mesh(geometry, material);
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
                        var objmesh = new THREE.Object3D();
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
                        var objmesh = new THREE.Object3D();
                        var geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        var edges = new THREE.EdgesHelper(object, 0x00ff00);
                        objmesh.add(object);
                        objmesh.add(edges);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'FaceNormalsHelper') {
                        var objmesh = new THREE.Object3D();
                        var geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        var edges = new THREE.FaceNormalsHelper(object, 2, 0x00ff00, 1);
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
                        var objmesh = new THREE.Object3D();
                        var pointLight = new THREE.PointLight(0xff0000, 1, 100);
                        pointLight.position.set(10, 10, 10);
                        objmesh.add(pointLight);
                        var sphereSize = 1;
                        var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
                        objmesh.add(pointLightHelper);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'SpotLightHelper') {
                        var objmesh = new THREE.Object3D();
                        var spotLight = new THREE.SpotLight(0xffffff);
                        spotLight.position.set(10, 10, 10);
                        objmesh.add(spotLight);
                        var spotLightHelper = new THREE.SpotLightHelper(spotLight);
                        objmesh.add(spotLightHelper);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'VertexNormalsHelper') {
                        var objmesh = new THREE.Object3D();
                        var geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        var edges = new THREE.VertexNormalsHelper(object, 2, 0x00ff00, 1);
                        objmesh.add(object);
                        objmesh.add(edges);
                        tmpobj = objmesh;
                    }
                    if (args['shape'] == 'WireframeHelper') {
                        var objmesh = new THREE.Object3D();
                        var geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2);
                        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                        var object = new THREE.Mesh(geometry, material);
                        var wireframe = new THREE.WireframeHelper(object, 0x00ff00);
                        objmesh.add(object);
                        objmesh.add(wireframe);
                        tmpobj = objmesh;
                    }
                    if (tmpobj != null) {
                        if (this.selectobject != null) {
                            this.selectobject.add(tmpobj);
                        }
                        else {
                            this.scene.add(tmpobj);
                        }
                        this.scenenodes.push(tmpobj);
                        console.log(tmpobj);
                        NodeSelectObject({ object: tmpobj });
                        tmpobj = null;
                        RefreshContent();
                    }
                }
            }
        };
        Game.prototype.createplayer = function (arg) {
            var player = function () {
                THREE.Object3D.apply(this);
                this.name = "none";
                return this;
            };
            player.prototype = Object.create(THREE.Object3D.prototype);
            player.prototype.init = function () {
            };
            player.prototype.update = function (delta) {
            };
            var tplayer = new player();
            this.scene.add(tplayer);
            console.log(tplayer);
            return tplayer;
        };
        Game.prototype.createcharacter = function () {
        };
        Game.prototype.getext = function (filename) {
            return filename.substr(filename.lastIndexOf('.'));
        };
        Game.prototype.LoadFile = function (filename) {
            console.log('file: ' + filename);
            if (this.getext(filename) == '.fbx') {
                this.LoadFBX(filename);
            }
            if (this.getext(filename) == '.dae') {
                this.LoadDAE(filename);
            }
            if (this.getext(filename) == '.obj') {
                this.LoadOBJ(filename);
            }
            if (this.getext(filename) == '.js') {
                this.LoadJSONObj(filename);
            }
        };
        Game.prototype.LoadJPEG = function (filename) {
        };
        Game.prototype.LoadPNG = function (filename) {
        };
        Game.prototype.LoadJPG = function (filename) {
        };
        Game.prototype.LoadGIF = function (filename) {
        };
        Game.prototype.LoadJSONObj = function (filename) {
            var filepath = "/assets/" + filename;
            var loader = new THREE.JSONLoader();
            var self = this;
            loader.load(filepath, function (geometry, materials) {
                var material = materials[0];
                material.morphTargets = true;
                material.color.setHex(0xffaaaa);
                var faceMaterial = new THREE.MultiMaterial(materials);
                var mesh = new THREE.Mesh(geometry, faceMaterial);
                self.scene.add(mesh);
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadFBX = function (filename) {
            var filepath = "/assets/" + filename;
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
                            var action = child.mixer.clipAction(child.geometry.animations[0]);
                            action.play();
                        }
                    }
                });
                self.scene.add(object);
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadDAE = function (filename) {
            var loader = new THREE.ColladaLoader(this.manager);
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
                dae.updateMatrix();
                self.scene.add(dae);
                console.log("added");
            }, this.onProgressModel, this.onErrorModel);
        };
        Game.prototype.LoadOBJ = function (filename) {
            var self = this;
            var filepath = "/assets/" + filename;
            var loader = new THREE.OBJLoader(this.manager);
            loader.load(filepath, function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                    }
                });
                self.scene.add(object);
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
            var boxShape1 = new CANNON.Box(new CANNON.Vec3(200, 20, 200));
            var boxBody1 = new CANNON.Body({ mass: 0, position: new CANNON.Vec3(0, -20, 0) });
            boxBody1.addShape(boxShape1);
            this.world.add(boxBody1);
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var boxShape2 = new CANNON.Box(new CANNON.Vec3(100, 15, 195));
            console.log(-Math.PI / 2);
            var boxBody2 = new CANNON.Body({ mass: 0 });
            boxBody2.addShape(boxShape2);
            boxBody2.position = new CANNON.Vec3(130, 40, 0);
            boxBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), (30 * Math.PI / 180));
            console.log(boxBody2.quaternion);
            this.world.add(boxBody2);
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            var mass = 5, radius = 2;
            var sphereShape = new CANNON.Sphere(radius);
            var sphereBody = new CANNON.Body({ mass: mass });
            sphereBody.addShape(sphereShape);
            sphereBody.angularDamping = 0.5;
            sphereBody.addEventListener("collide", function (e) { console.log("sphere collided"); });
            this.bodies[0] = sphereBody;
            var x = 150;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            sphereBody.position.set(x, y, z);
            this.world.add(sphereBody);
            var buffgeoSphere = new THREE.BufferGeometry();
            buffgeoSphere.fromGeometry(new THREE.SphereGeometry(2, 20, 10));
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            this.scene.add(this.meshs[0]);
        };
        Game.prototype.updateCannonPhysics = function () {
            if (typeof CANNON != undefined) {
                this.world.step(this.timeSteptimeStep);
                for (var i = 0; i < this.bodies.length; i++) {
                    var mesh = this.meshs[i];
                    var body = this.bodies[i];
                    mesh.position.copy(body.position);
                    mesh.quaternion.copy(body.quaternion);
                }
            }
        };
        Game.prototype.destroyCannonPhysics = function () {
            console.log('destroyCannonPhysics');
        };
        Game.prototype.initAmmoPhysics = function () {
            if (typeof Ammo != undefined) {
                console.log('init Ammo');
                this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
                this.dispatcher = this.dp = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
                this.overlappingPairCache = new Ammo.btDbvtBroadphase();
                this.solver = new Ammo.btSequentialImpulseConstraintSolver();
                this.world = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
                this.world.setGravity(new Ammo.btVector3(0, -10, 0));
                this.trans = new Ammo.btTransform();
                this.createAmmoScene();
            }
        };
        Game.prototype.createAmmoScene = function () {
            var groundShape = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200));
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
            this.world.addRigidBody(body);
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var groundShape2 = new Ammo.btBoxShape(new Ammo.btVector3(200, 20, 200));
            var groundTransform2 = new Ammo.btTransform();
            groundTransform2.setIdentity();
            groundTransform2.setOrigin(new Ammo.btVector3(130, 40, 0));
            var q = new Ammo.btQuaternion(0, 0, 0.25881904510252074, 0.9659258262890683);
            groundTransform2.setRotation(q);
            console.log(groundTransform2);
            var localInertia2 = new Ammo.btVector3(0, 0, 0);
            if (isDynamic)
                groundShape2.calculateLocalInertia(mass, localInertia2);
            var myMotionState2 = new Ammo.btDefaultMotionState(groundTransform2);
            var rbInfo2 = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState2, groundShape2, localInertia2);
            var body2 = new Ammo.btRigidBody(rbInfo2);
            this.world.addRigidBody(body2);
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            var x = 150;
            var z = -100 + Math.random() * 200;
            var y = 100 + Math.random() * 1000;
            var colShape = new Ammo.btSphereShape(1);
            var startTransform = new Ammo.btTransform();
            startTransform.setIdentity();
            var mass = 1;
            var isDynamic = (mass != 0);
            var localInertia = new Ammo.btVector3(0, 0, 0);
            if (isDynamic)
                colShape.calculateLocalInertia(mass, localInertia);
            startTransform.setOrigin(new Ammo.btVector3(x, y, z));
            var myMotionState = new Ammo.btDefaultMotionState(startTransform);
            var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia);
            var body = new Ammo.btRigidBody(rbInfo);
            this.world.addRigidBody(body);
            this.bodies.push(body);
            var buffgeoSphere = new THREE.BufferGeometry();
            buffgeoSphere.fromGeometry(new THREE.SphereGeometry(1, 20, 10));
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            this.scene.add(this.meshs[0]);
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
                    if (body.getMotionState()) {
                        body.getMotionState().getWorldTransform(this.trans);
                        mesh.position.set(this.trans.getOrigin().x().toFixed(2), this.trans.getOrigin().y().toFixed(2), this.trans.getOrigin().z().toFixed(2));
                        mesh.rotation.set(this.trans.getRotation().x().toFixed(2), this.trans.getRotation().y().toFixed(2), this.trans.getRotation().z().toFixed(2), this.trans.getRotation().w().toFixed(2));
                    }
                }
            }
        };
        Game.prototype.destroyAmmoPhysics = function () {
            Ammo.destroy(this.collisionConfiguration);
            Ammo.destroy(this.dispatcher);
            Ammo.destroy(this.overlappingPairCache);
            Ammo.destroy(this.solver);
        };
        Game.prototype.initOimoPhysics = function () {
            if (typeof OIMO != undefined) {
                this.world = new OIMO.World(1 / 60, 2);
                this.world.clear();
                this.createOimoScene();
                this.infos = document.getElementById("info");
            }
        };
        Game.prototype.createOimoScene = function () {
            console.log('init oimo.js');
            var group1 = 1 << 0;
            var group2 = 1 << 1;
            var group3 = 1 << 2;
            var all = 0xffffffff;
            var config = [
                1,
                0.4,
                0.2,
                1,
                0xffffffff
            ];
            var ground = this.world.add({ name: "ground", size: [400, 40, 400], pos: [0, -20, 0], config: config });
            this.addStaticBox([400, 40, 400], [0, -20, 0], [0, 0, 0], false);
            var ground2 = this.world.add({ name: "ground2", size: [200, 30, 390], pos: [130, 40, 0], rot: [0, 0, 32], config: config });
            this.addStaticBox([200, 30, 390], [130, 40, 0], [0, 0, 32], false);
            config[3] = group1;
            config[4] = all & ~group2;
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
            config[3] = group2;
            this.bodies[0] = this.world.add({ type: 'sphere', size: [w * 0.5], pos: [x, y, z], move: true, config: config });
            this.bodies[0].name = "sphere";
            this.meshs[0] = new THREE.Mesh(buffgeoSphere, this.matSphere);
            this.meshs[0].scale.set(w * 0.5, w * 0.5, w * 0.5);
            this.scene.add(this.meshs[0]);
        };
        Game.prototype.updateOimoPhysics = function () {
            if ((typeof this.world == 'undefined') || (this.world == null)) {
                return;
            }
            this.world.step();
            this.infos.innerHTML = this.world.performance.show();
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
                    mesh.quaternion.copy(body.getQuaternion());
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
        Game.prototype.update = function () {
            var _this = this;
            requestAnimationFrame(function () { _this.update(); });
            var width = window.innerWidth;
            var height = window.innerHeight;
            if (this.cube != null) {
                this.cube.rotation.x += 0.1;
                this.cube.rotation.y += 0.1;
            }
            if (this.scene != null) {
                this.scene.traverse(function (object) {
                    if (typeof object.update != 'undefined') {
                        object.update();
                    }
                });
            }
            this.effectComposer.render();
            this.updatePhysics();
            width = null;
            height = null;
        };
        return Game;
    }());
    ThreejsAPI.Game = Game;
    var Editor = (function () {
        function Editor() {
            this.init();
        }
        Editor.prototype.init = function () {
        };
        return Editor;
    }());
    ThreejsAPI.Editor = Editor;
})(ThreejsAPI || (ThreejsAPI = {}));
var threejsapi;
