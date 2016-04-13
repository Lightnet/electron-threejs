var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');
var fs = require('fs');
var environment = args.env || "development";
var common_config = {
    name: "PCRPGOW",
    version: "0.0.1",
    SECRET: 'secret',
    KEY: 'express.sid',
    bdatabasesession: true,
    environment: environment,
    database_url: 'mongodb://127.0.0.1/mmo',
    database_type: "mongodb",
    cachetime: (365 * 24 * 60 * 60 * 1000)
};
var tokenkeys = require("./tokenkeys.json");
extend(false, common_config, tokenkeys);
var conf = {
    production: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8080,
        mode: "production",
        benablemodules: true
    },
    development: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8080,
        mode: "development",
        benablemodules: true
    },
    alpha: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8080,
        mode: "alpha",
        benablemodules: true
    }
};
extend(false, conf.production, common_config);
extend(false, conf.development, common_config);
extend(false, conf.alpha, common_config);
module.exports = config = conf[environment];
