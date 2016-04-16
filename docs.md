# electron-threejs

 Created by: Lightnet

# working features:
 * database -deal with file manage without need to used fs not too much dealing with dir folder listing.
 * drag file to scene editor to upload files filter by type extensions. Work in progress.
 * rename file assets & delete
 * preview assets mesh and texture
 * add and remove scene object and parenting object.
 * add some base shapes
 * javascript files can be edited and can be attaching script component to object3d.
 * script code editor (save/rename)
 * object properties variables are limited in transform edit (position, rotation, scale, visible)
 * rename/new/copy function may not work in many places.

# Plugins:(they can be turn off/on for projects test build that might conflict other similar builds)
 * baseplugin -basic setup
 * latency_io -test socket.io & engine.io ping time different
 * threejs-editor (current from src threejs)
 * threejs-headless-template -tested simple threejs headless server scene for webgl
 * threejs-rpg (work in progress)
 * threejs-rts (just empty project)
 * threejs-physics (simple physics test)

## Features:
 * Development for web game builds. (work in progress)
 * Run the server express.
 * Run RethinkDB for real time database.
 * Socket.io for chat messages (work in progress)
 * Engine.io for server side game object and message. (work in progress)

## Base stuff:
 * Currently it start a server from background and not the window browser.
 * localhost/editor.html (url for threejs editor)
 * localhost/threejs-editor.html  (work in progress)
 * localhost/threejs-physics.html  (working)

## Application Menus
  * Check Status (no function yet)
  * Start server (no function yet)
  * Client Game (no function yet)
  * Settings (no function yet)
  * Start Game (work in progress)

## Notes:
  * Not recommend for hosting that is under development.
  * var engineio = eio(); //bug using the IPv6 using http://[[ipadress]] <- wrong instead http://[ipadress]
  * FBX 2013.3 Converter ASCII

## nodejs packages:
  * rethinkdb
  * protobufjs
  * ammo.js
  * express
  * socket.io
  * engine.io
  * async
  * helmet
  * jsdom
  * xmlhttprequest

## web browser javascript:
  * long.min.js https://github.com/dcodeIO/long.js
  * bytebuffer.min.js https://github.com/dcodeIO/bytebuffer.js
  * protobuf.min.js https://github.com/dcodeIO/protobuf.js
  * playcanvas-stable.js http://playcanvas.com
  * smoothie.js http://smoothiecharts.org/

## rethinkdb
 * r.table('assets').filter(  r.row('name').match('.js$')  ) //get the assets files list
