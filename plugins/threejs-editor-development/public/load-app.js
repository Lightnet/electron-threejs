var loader = new THREE.XHRLoader();
var threejapp
loader.load( 'post-app.json', function ( text ) {
	var mappdata = JSON.parse( text );
	console.log(mappdata);
	threejapp = new ThreejsAPI.Game({onload:false});
	

});
