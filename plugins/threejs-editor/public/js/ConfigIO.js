/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function () {

	var name = 'threejs-editor';

	var storage = {
		'autosave': true,
		'theme': 'css/light.css',

		'project/renderer': 'WebGLRenderer',
		'project/renderer/antialias': true,
		'project/renderer/shadows': true,
		'project/editable': false,
		'project/vr': false,

		'settings/history': false,

		'ui/sidebar/animation/collapsed': true,
		'ui/sidebar/script/collapsed': true
	};

	if ( window.localStorage[ name ] === undefined ) {
		console.log(storage);
		window.localStorage[ name ] = JSON.stringify( storage );
		if(socketio !=null){
			//socketio.emit('config',{name:name,storage:storage});
			console.log(socketio);
			console.log('[config ====]');
		}
	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {
			storage[ key ] = data[ key ];
			//console.log("config key: "+key + " : "+ data[ key ]);
			socketio.emit('setconfigkey', {name:name,key:key,storage:data[ key ]});
		}
		//if(socketio !=null){
			//socketio.emit('config',{name:name,storage:storage});
			//console.log(socketio);
			//console.log('[config ====]');
		//}

	}

	return {

		getKey: function ( key ) {
			//console.log(" getKey: function ");
			//console.log("key:"+key);
			//console.log("storage:" + storage[ key ]);
			if(socketio !=null){
				socketio.emit('getconfigkey', {name:name,key:key});
				//console.log('get key');
				socketio.on('configkey',function(object){
					console.log("server data:"+object);
				});
			}
			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...
			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {
				console.log(arguments[ i + 1 ] + " : " + storage[ arguments[ i ] ]);

				if(socketio !=null){
					socketio.emit('setconfigkey', {name:name,key:arguments[ i + 1 ],storage:storage[ arguments[ i ] ]});
				}
				storage[ arguments[ i ] ] = arguments[ i + 1 ];
			}
			//console.log(name);
			//console.log(storage);

			//socketio.emit('setkey',  {key:key,storage:storage[ key ]});
			//console.log("set key+++++++++++++++++++++++++++");

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];
			socketio.emit('configclear',{name:name,storage:storage});

		}

	};

};
