
var threejsangular = angular.module('threejsangular', []);

//http://jsfiddle.net/ftfish/KyEr3/

//<div ng-controller="MainCtrl as vm">
//<nodeinputcomponent params="vm.params"></nodeinputcomponent> //passing variable
//<div>
threejsangular.controller('NodeCtrl', function NodeCtrl($scope) {
  var self= this;
  $scope.init = function(params){
	  self.params = params;
	  console.log(self.params);
  }
});
//===============================================
// Node label
//===============================================
//<nodeinputcomponent params="params='name'"></nodeinputcomponent>
threejsangular.component('nodelabelcomponent', {
	bindings: {
		params:'=' //bind from element attribute
	},
	scope: {
		value:'=' //local var
	},
  	controller:'nodelabelCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>:`+
					`<label>{{$ctrl.value}}<label>` +
				`</div>`;
	}
}).controller('nodelabelCtrl', function nodelabelCtrl($scope) {
	this.$onInit = function () {
		// component initialisation
		this.value = _.get(cube, this.params);
		console.log(this);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});
//===============================================
// Node Input
//===============================================
//<nodeinputcomponent params="params='name'"></nodeinputcomponent>
threejsangular.component('nodeinputcomponent', {
	bindings: {
		params:'=',
		value:'='
	},
  	controller:'nodeinputCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>`+
					`<input type="input" ng-model="value" ng-value="value" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodeinputCtrl', function nodebooleanCtrl($scope) {
	function change() {
	  console.log($scope.$ctrl.params);
	  _.set(cube, $scope.$ctrl.params, $scope.value);
	  console.log(cube);
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		console.log(this);
		$scope.value = _.get(cube, $scope.$ctrl.params);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

//===============================================
// Node boolean
//===============================================
//`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`
threejsangular.component('nodebooleancomponent', {
	bindings: {
		params:'=',
		confirmed:'='
	},
  	controller:'nodebooleanCtrl',
  	template: function($element, $attrs){
		return `<div>`+
					`<label>{{$ctrl.params}}</label>`+
					`<input type="checkbox" ng-model="confirmed" ng-change="$ctrl.change()" />` +
				`</div>`;
	}
}).controller('nodebooleanCtrl', function nodebooleanCtrl($scope) {
	function change() {
	  //console.log($scope.$ctrl.params);
	  _.set(cube, $scope.$ctrl.params, $scope.confirmed);
	};
	this.change = change;
	this.$onInit = function () {
		// component initialisation
		$scope.confirmed = _.get(cube, $scope.$ctrl.params);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

//===============================================
// node components
//===============================================
//`<nodecomponent ></nodecomponent>`
threejsangular.component('nodecomponent', {
	bindings: {
		//count: '='
	},
  	controller:'nodecomponentCtrl',
  	template: function($element, $attrs){
		//
		return 	``+
				`<button ng-click="$ctrl.refresh();">Ctrl Refresh</button>`+
				`<button objectnodecomponets>Refresh</button>`+
			   	`<button clearobjectnodes>Clear Props</button>`+
				`<button clearobjectnodes onclick="orefresh();">Refresh Call</button>`+
				`<button clearobjectnodes onclick="getscope();">Scope Refresh Call</button>`
				;
	}
}).controller('nodecomponentCtrl', function nodecomponentCtrl($scope) {
	function refresh() {
		orefresh();
		/*
		console.log('refesh props');
		var $target = document.getElementById('listcomponent');
		var myEl = angular.element(
			$target
		);
		myEl.empty();
		//console.log(this);
		angular.element($target).injector().invoke(function($compile) {
    		var scope = angular.element($target).scope();
    		angular.element($target).append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
    		// Finally, refresh the watch expressions in the new element
    		//scope.$apply();
			console.log('add?');
  		});
		*/
	}
	this.refresh = refresh;
	this.$onInit = function () {
    	// component initialisation
		//console.log($scope);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
});

threejsangular.directive("clearobjectnodes", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			//scope.count++;
			//console.log('add?');
			var myEl = angular.element(
				document.getElementById('listcomponent')
			);
			myEl.empty();
		});
	};
});

//Directive for adding buttons on click that show an alert on click
threejsangular.directive("objectnodecomponets", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			//scope.count++;
			console.log('add?');
			var myEl = angular.element(
				document.getElementById('listcomponent')
			);
			//clear children
			myEl.empty();

			if(cube['uuid'] !=null){
				myEl.append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
			}
			if(cube['visible'] !=null){
				myEl.append($compile(`<nodebooleancomponent params="params='visible'"></nodebooleancomponent>`)(scope));
			}
			if(cube['position'] !=null){
				myEl.append($compile(`<nodeinputcomponent params="params='position.x'"></nodeinputcomponent>`)(scope));
				myEl.append($compile(`<nodeinputcomponent params="params='position.y'"></nodeinputcomponent>`)(scope));
				myEl.append($compile(`<nodeinputcomponent params="params='position.z'"></nodeinputcomponent>`)(scope));
			}
		});
	};
});

function orefresh(){
	setTimeout(function () {
		var $target = document.getElementById('listcomponent');
		var myEl = angular.element(
			$target
		);
		myEl.empty();
		//console.log(this);
		angular.element($target).injector().invoke(function($compile) {
			var scope = angular.element($target).scope();
			angular.element($target).append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
			// Finally, refresh the watch expressions in the new element
			scope.$apply();
			console.log('add?');
		});
	}, 50);
}

//http://jsfiddle.net/austinnoronha/nukRe/light/
function getscope(){
	setTimeout(function () {
		var $target = document.getElementById('listcomponent');
		var myEl = angular.element(
			$target
		);
		myEl.empty();
		//console.log(this);
		angular.element($target).injector().invoke(function($compile) {
			var scope = angular.element($target).scope();
			angular.element($target).append($compile(`<nodelabelcomponent params="params='uuid'"></nodelabelcomponent>`)(scope));
			// Finally, refresh the watch expressions in the new element
			scope.$apply();
			console.log('add?');
		});
	}, 50);
}
