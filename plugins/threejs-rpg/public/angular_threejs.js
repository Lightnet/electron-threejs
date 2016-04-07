
var ang = angular.module('changeExample', [])
ang.controller('ExampleController', ['$scope', function($scope) {
      $scope.counter = 0;
	  console.log('test');
      $scope.change = function() {
		console.log($scope);
        $scope.counter++;
      };
}]);

ang.controller('ControllerText', ['$scope', function($scope) {
	$scope.init = function(params)
  	{
		$scope.params = params;
		$scope.name = _.get(cube, params);
  	}
	//$scope.name = 'Whirled';
	console.log($scope);
}]);

ang.controller('ControllerBoolean', ['$scope', function($scope) {
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

ang.controller('ControllerInput', ['$scope', function($scope) {
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

ang.controller('ExampleControllerAdd', ['$scope', function($scope) {
	$scope.items = [{'item':'test0'},{'item':'test1'},{'item':'test2'}];
	$scope.additem = function() {
	  console.log($scope);

	  $scope.items.push({'item':'test0'});
	};
}]);

/*
var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', function ($scope) {

	//var query = element(by.model('query'));

  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});
*/
