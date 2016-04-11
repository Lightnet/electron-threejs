# electron-threejs

 Created by: Lightnet

## License:
  [CC0 (Public Domain)](LICENSE.md)

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
 * localhost/threejs-rpg  (work in progress)
 * localhost/threejs-custom.html  (work in progress)
 * localhost/threejs-physics.html  (working)
 * localhost/upload.html  (working, simple upload file)

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