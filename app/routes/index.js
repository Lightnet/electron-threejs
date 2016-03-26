/*
	Name:
	Link:https://bitbucket.org/Lightnet/
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/

var express = require('express');

var router = express.Router();

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

/*
router.get('/test', function(req, res){
    res.render("test",{});
});
*/

module.exports = router;
