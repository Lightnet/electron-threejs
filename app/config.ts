/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/


/* global config */
//import required lib
var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');
var fs = require('fs');
var environment = args.env || "development";

var common_config = {
	name:"PCRPGOW",
	version:"0.0.1",
	SECRET:'secret', //express secret key
	KEY:'express.sid', //express key
	bdatabasesession:true,
	environment:environment,
	database_url:'mongodb://127.0.0.1/mmo',
	database_type:"mongodb",
	cachetime:(365 * 24 * 60 * 60 * 1000)
	//max_player:100,
}
//token key
var tokenkeys = require("./tokenkeys.json");
extend(false, common_config, tokenkeys);

//environment specific configuration
var conf = {
	production:{
		ip: args.ip || "0.0.0.0",
		port: args.port || 8080,
		mode:"production",
		benablemodules: true
	},
	development:{
		ip: args.ip || "0.0.0.0",
		port: args.port || 8080,
		mode:"development",
		benablemodules: true
	},
	alpha:{
		ip: args.ip || "0.0.0.0",
		port: args.port || 8080,
		mode:"alpha",
		benablemodules: true
	}
}

extend(false, conf.production, common_config);
extend(false, conf.development, common_config);
extend(false, conf.alpha, common_config);

//set config on the arguments default
module.exports = config = conf[environment];
