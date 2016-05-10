
## To Do List:
 * co-op editing and game (not build)
 * game networking (not build)
 * server network (not build)
 * Editor
  * Basic layout / Game Mode (not build)
  * Mouse & object handler not yet work for position, rotation, scale. (work in progress)
 * Database
  * RethinkDB
 * Save & Load
  * Basic shapes objects (work in progress)
  * Script components (work in progress)
  * 3D Model (not build)
  * Materials &  Textures (not build)
 * Editor / Loading areas
  * Loading the assets partly done.
  * Loading screen (not build)

Code Editor:
 * Save file
 * ...

 Assets:
  * model viewing (working)
  * script code editor (working)
  * prefabs file (not build)

  map scene node
  //mapscenenodes:any = [];//js

  var object3d = {
  	"id":"",
  	"name":"",
  	"type":"object3d",
  	"visible": true,
  	"position":[0,0,0],
  	"rotation":[0,0,0],
  	"scale":[1,1,1],
  	"parent":"",
  	"children":{},
  	"mesh":{},
  	"rigbody":{},
  	"animations":{},
  	"bones":{},
  	"textures":{},
  	"materials":{},
  	"scripts":{}
  }
