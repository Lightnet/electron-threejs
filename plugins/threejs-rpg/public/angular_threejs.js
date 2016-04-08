
var threejsangular = angular.module('changeExample', []);

threejsangular.controller('ExampleController', ['$scope', function($scope) {
      $scope.counter = 0;
	  console.log('test');
      $scope.change = function() {
		console.log($scope);
        $scope.counter++;
      };
}]);

threejsangular.controller('ControllerText', ['$scope', function($scope) {
	console.log('text?');
	$scope.init = function(params)
  	{
		$scope.params = params;
		$scope.name = _.get(cube, params);
		console.log($scope.name);
  	}
	//$scope.name = 'Whirled';
	//console.log($scope);
}]);

threejsangular.controller('ControllerBoolean', ['$scope', function($scope) {
	//console.log('test');
	$scope.init = function(params)
  	{
		$scope.params = params;
		$scope.confirmed = _.get(cube, params);
  	}
	$scope.change = function() {
	  //console.log($scope.confirmed);
	  //console.log(cube);
	  _.set(cube, $scope.params, $scope.confirmed);
	};
}]);

threejsangular.controller('ControllerInput', ['$scope', function($scope) {
	//console.log($scope);
	$scope.init = function(params)
  	{
		$scope.params = params;
		$scope.value = _.get(cube, params);
  	}
	$scope.inputchange = function() {
		_.set(cube, $scope.params, parseFloat($scope.value));
		console.log(cube);
		console.log($scope);
	};
}]);



//http://jsfiddle.net/ftfish/KyEr3/


/*
function ControllerNodeObject($scope,$element,$attrs){
	$scope.count++;
	console.log('$scope?');
	console.log($scope);
	console.log($element);
	console.log($attrs);
	$element.bind("click", function(){
		console.log('add');
		scope.count++;
		angular.element(document.getElementById('space-for-buttons')).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));
	});
}
*/

threejsangular.component('nodecomponent', {
	bindings: {
		hero: '=',
		count: '='
	},
  	controller:'CounterCtrl',
  	template: function($element, $attrs){
		//
		return `<button addbuttons>Click to add buttons</button>`+
		`<button listcompement ng-click="AppendText();">Refresh</button>` +
		`<input type="text" ng-model="$ctrl.count">` +
		`<button type="button" ng-click="$ctrl.decrement();">-</button>` +
		`<button type="button" ng-click="$ctrl.increment();">+</button>`
		;
	}
}).controller('CounterCtrl', function CounterCtrl($scope) {
	$scope.AppendText = function() {
		var myEl = angular.element( document.querySelector( '#listcomponent' ) );
		//myEl.append('Hi<br/>');
		//myEl.append('<data-my-template/>');

		if(cube['uuid'] != null){
			console.log(cube['uuid']);
			myEl.append($scope(`<div ng-controller="ControllerText" ng-init="init('uuid')"><span ng-bind="name"></span></div>`));
		}
		if(cube['name'] != null){
			myEl.append($scope(`<div ng-controller="ControllerInput">`+
				`<input type="input" ng-change="inputchange()" ng-model="value" ng-value="value" ng-init="init('name')" />`+
				`</div>`));
		}
	}
	this.$onInit = function () {
    	// component initialisation
		console.log($scope);
  	};
  	this.$postLink = function () {
    	// component post-link
  	};
  	this.$onDestroy = function () {
    	// component $destroy function
  	};
  	function increment() {
    	this.count++;
  	}
  	function decrement() {
    	this.count--;
  	}
  	function refresh(){
	  	console.log(this);
  	}
  	this.increment = increment;
  	this.decrement = decrement;
  	this.refresh = refresh;
}).controller('MainCtrl', function MainCtrl() {
  this.count = 4;
});


//Directive for adding buttons on click that show an alert on click
threejsangular.directive("addbuttons", function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			//scope.count++;
			console.log('add?');
			//var myEl = angular.element( document.querySelector( '#listcomponent' ) );
			//myEl.append($compile(`<div ng-controller="ControllerText" ng-init="init('uuid')"><span ng-bind="name"></span></div>`)(scope));

			//angular.element(
				//document.getElementById('listcomponent')
			//).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));

			var myEl = angular.element(
				document.getElementById('listcomponent')
			);
			//myEl.append($compile(`<div ng-controller="ControllerText" ng-init="init('uuid')"><span ng-bind="name"></span></div>`)(scope));
			myEl.append($compile(`<div><div ng-controller="ControllerText" ng-init="init('uuid')"><span ng-bind="name"></span></div></div>`)(scope));

			myEl.append($compile(`<div ng-controller="ControllerBoolean">`+
				`<input type="checkbox" ng-model="confirmed" ng-change="change()" ng-init="init('visible')" />`+
			`</div>`)(scope));

		});
	};
});



/*
threejsangular.directive('listnodecompement', function($compile){
	return function(scope, element, attrs){
		element.bind("click", function(){
			console.log('add');
			scope.count++;
			angular.element(document.getElementById('space-for-buttons')).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));
		});
	};
});
*/

/*
function addController($compile){
   return function(scope, element, attrs){
	   element.bind("click", function(){
		   scope.count++;
		   angular.element(document.getElementById('space-for-buttons')).append($compile("<div><button class='btn btn-default' data-alert="+scope.count+">Show alert #"+scope.count+"</button></div>")(scope));
	   });
};

threejsangular.component('addbuttons', {
  //templateUrl: 'heroDetail.html',
  //controller: addController,
  //bindings: {
    //hero: '='
  //}
  template: "<button addbuttons>Click to add buttons</button>"
});
*/




threejsangular.controller('ControllerSceneObject', ['$scope', function($scope) {
	//$scope.items = [{'item':'test0'},{'item':'test1'},{'item':'test2'}];
	$scope.Refresh = function() {
		console.log('ControllerSceneObject');
		if(cube['name'] !=null){

		}
	}
	$scope.additem = function() {
	  console.log($scope);
	  //$scope.items.push({'item':'test0'});
	};
}]);
//http://jsfiddle.net/austinnoronha/nukRe/light/

function getscope(){
	var scope = angular.element(document.getElementById('yourControllerElementID')).scope();
	console.log(scope);
}

threejsangular.controller('ExampleControllerAdd', ['$scope', function($scope) {
	$scope.items = [{'item':'test0'},{'item':'test1'},{'item':'test2'}];
	$scope.additem = function() {
	  console.log($scope);
	  $scope.items.push({'item':'test0'});
	};
}]);



console.log(angular);

function HeroDetailController() {

}

threejsangular.component('heroDetail', {
  templateUrl: 'heroDetail.html',
  controller: HeroDetailController,
  bindings: {
    hero: '='
  }
});


/*
var Counter = ang
.component({
  selector: 'counter',
  template: [
    '<div class="todo">',
      '<input type="text" [(ng-model)]="count">',
      '<button type="button" (click)="decrement();">-</button>',
      '<button type="button" (click)="increment();">+</button>',
    '</div>'
  ].join('')
})
.Class({
  constructor: function () {
    this.count = 0;
  },
  increment: function () {
    this.count++;
  },
  decrement: function () {
    this.count--;
  }
});
*/
//
