/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/




r = require('rethinkdb');
connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
	console.log('connect?');
});

/*
setTimeout(function(){
	try{
		r.db('test').tableCreate('socketio').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});

		r.db('test').tableCreate('engineio').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});

		r.db('test').tableCreate('account').run(connection, function(err, result) {
		    //if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});
	}catch(e){
		console.log(e)
	}
},2000);
*/
