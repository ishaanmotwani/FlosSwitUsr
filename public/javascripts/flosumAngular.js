var app = angular.module('Flosum', ['ngResource','ngRoute']);
app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
        })
		.when('/switchUser', {
            templateUrl: 'partials/switchUser.html',
			controller: 'switchUserCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.controller('HomeCtrl', ['$scope', '$resource', 
    function($scope, $resource){
		var flosumUsers = $resource('/api/activeUsers');
        flosumUsers.query(function(Users){
			$scope.activeFlosumUsers = Users;
        });
	}]);

app.controller('switchUserCtrl', ['$scope', '$resource', '$location', 
    function($scope, $resource, $location){
		var flosumUsers = $resource('/api/switchUsers');
        flosumUsers.query(function(Users){
			var activeUsers = [];
			var inactiveUsers = [];
			var i;
			for (i = 0; i < Users.length; i++) { 
				if(Users[i].IsActive){
					activeUsers.push(Users[i]);
				}
				else{
					inactiveUsers.push(Users[i]);
				}
			}
			$scope.activeUsers = activeUsers;
			$scope.inactiveUsers = inactiveUsers;
			
			$scope.save = function(){
				var doSwitch = $resource('/api/doSwitch');
				doSwitch.save($scope.flosum, function(){
					$location.path('/');
				});
			};
        });
    }]);	
