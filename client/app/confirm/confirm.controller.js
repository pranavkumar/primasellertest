'use strict';

angular.module('primasellertestApp')
  .controller('ConfirmCtrl', function ($scope,$routeParams,$http) {
    $scope.message = 'Hello';
    $scope.username="";
    $scope.seats;
    console.log($routeParams);
    $http.get('/api/reservations/'+$routeParams._id)
    	.success(function(data,status,config,headers){
    		console.log(data);
    		$scope.username = data.username;
    		$scope.seats = data.seats;
    	});
  });
