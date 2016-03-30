//wait for socket.io to connect to server
function initEditor(){
window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

Number.prototype.format = function (){
	return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

//

var editor = new Editor();

var viewport = new Viewport( editor );
document.body.appendChild( viewport.dom );

var script = new Script( editor );
document.body.appendChild( script.dom );

var player = new Player( editor );
document.body.appendChild( player.dom );

var toolbar = new Toolbar( editor );
document.body.appendChild( toolbar.dom );

var menubar = new Menubar( editor );
document.body.appendChild( menubar.dom );

var sidebar = new Sidebar( editor );
document.body.appendChild( sidebar.dom );

var modal = new UI.Modal();
document.body.appendChild( modal.dom );

//

editor.setTheme( editor.config.getKey( 'theme' ) );

editor.storage.init( function () {

	editor.storage.get( function ( state ) {

		if ( isLoadingFromHash ) return;

		if ( state !== undefined ) {

			editor.fromJSON( state );

		}

		var selected = editor.config.getKey( 'selected' );

		if ( selected !== undefined ) {

			editor.selectByUuid( selected );

		}

	} );

	//

	var timeout;

	function saveState( scene ) {

		if ( editor.config.getKey( 'autosave' ) === false ) {

			return;

		}

		clearTimeout( timeout );

		timeout = setTimeout( function () {

			editor.signals.savingStarted.dispatch();

			timeout = setTimeout( function () {

				editor.storage.set( editor.toJSON() );

				editor.signals.savingFinished.dispatch();

			}, 100 );

		}, 1000 );

	};

	var signals = editor.signals;

	signals.geometryChanged.add( saveState );
	signals.objectAdded.add( saveState );
	signals.objectChanged.add( saveState );
	signals.objectRemoved.add( saveState );
	signals.materialChanged.add( saveState );
	signals.sceneGraphChanged.add( saveState );
	signals.scriptChanged.add( saveState );
	signals.historyChanged.add( saveState );

	signals.showModal.add( function ( content ) {

		modal.show( content );

	} );

} );

//

document.addEventListener( 'dragover', function ( event ) {

	event.preventDefault();
	event.dataTransfer.dropEffect = 'copy';

}, false );

document.addEventListener( 'drop', function ( event ) {

	event.preventDefault();

	if ( event.dataTransfer.files.length > 0 ) {

		editor.loader.loadFile( event.dataTransfer.files[ 0 ] );

	}

}, false );

document.addEventListener( 'keydown', function ( event ) {

	switch ( event.keyCode ) {

		case 8:
			event.preventDefault(); // prevent browser back

			var object = editor.selected;

			if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

			var parent = object.parent;
			if ( parent !== null ) editor.execute( new RemoveObjectCommand( object ) );

			break;

		case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

			if ( event.ctrlKey && event.shiftKey ) {

				editor.redo();

			} else if ( event.ctrlKey ) {

				editor.undo();

			}
			break;

	}

}, false );

function onWindowResize( event ) {

	editor.signals.windowResize.dispatch();

}

window.addEventListener( 'resize', onWindowResize, false );

onWindowResize();

//

var isLoadingFromHash = false;
var hash = window.location.hash;

if ( hash.substr( 1, 5 ) === 'file=' ) {

	var file = hash.substr( 6 );

	if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {
		var loader = new THREE.XHRLoader();
		loader.crossOrigin = '';
		loader.load( file, function ( text ) {
			editor.clear();
			editor.fromJSON( JSON.parse( text ) );
		} );
		isLoadingFromHash = true;
	}
}

/*
window.addEventListener( 'message', function ( event ) {

	editor.clear();
	editor.fromJSON( event.data );

}, false );
*/
}
