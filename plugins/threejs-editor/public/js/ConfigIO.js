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
			socketio.emit('config',storage);
			console.log(socketio);
			console.log('config+++++++++++++++++++++++++++');
		}
	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}
		if(socketio !=null){
			socketio.emit('config',storage);
			console.log(socketio);
			console.log('config+++++++++++++++++++++++++++');
		}

	}

	return {

		getKey: function ( key ) {
			console.log("key:"+key);

			if(socketio !=null){
				socketio.emit('getkey', key);
				console.log('get key+++++++++++++++++++++++++++');
			}

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...
			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];
			}
			//console.log(name);
			//console.log(storage);
			if(socketio !=null){
				socketio.emit('setkey', {name:name,storage:storage});
				console.log("set key+++++++++++++++++++++++++++");
			}


			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

};
