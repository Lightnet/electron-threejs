/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

rethinkdb = require('rethinkdb');

connection = null;
rethinkdb.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
	console.log('connected to rethinkdb!');
	CheckDataBase('test');
	CheckTable('test','assets');
	CheckTable('test','config');
	CheckTable('test','mapscene');

	//CheckTable('test','beta');
});
//create database name
function CheckDataBase(tablename){
	if((rethinkdb !=null)&&(connection !=null)){
		//console.log('database check');
		rethinkdb.dbList().contains(tablename)
	  .do(function(databaseExists) {
		  	//console.log(databaseExists);
		    return rethinkdb.branch(
		      databaseExists,
		      { created: 0 },
		      rethinkdb.dbCreate(tablename)
		    );
	  }).run(connection);
  	}
}
//create database table
function CheckTable(databasename,tablename){
	if((rethinkdb !=null)&&(connection !=null)){
		//console.log('database table check');
		rethinkdb.db(databasename).tableList().contains(tablename)
	  		.do(function(databaseExists) {
		  		//console.log(databaseExists);
	    		return rethinkdb.branch(
	      		databaseExists,
	      		{ created: 0 },
	      		rethinkdb.db(databasename).tableCreate(tablename)
	    		);
	  		}).run(connection, function(err, result) {
		    	if (err) throw err;
		    	//console.log(JSON.stringify(result, null, 2));
			});
  	}
}
