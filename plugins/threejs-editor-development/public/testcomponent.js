/*
	Name:
	Link:https://github.com/Lightnet/electron-threejs
	Created By: Lightnet
	License: Creative Commons Zero [Note there multiple Licenses]
  	Please read the readme.txt file for more information.
*/


createscript('testcomponent', function(app){
    var test1 = function(entity){
        this.entity = entity;
		this.text = "test";
		this.count = 0;
    }
    test1.prototype = {
        init:function(){
        console.log(test);
    },
	init:function(){
	    console.log('test');
    },
    test1:function(){
	    console.log('test');
    },
	update:function(){
	    console.log('test');
    }
    };
    return test1;
});
