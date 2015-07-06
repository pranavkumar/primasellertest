'use strict';

angular.module('primasellertestApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/confirm', {
        templateUrl: 'app/confirm/confirm.html',
        controller: 'ConfirmCtrl'
      })
      .when('/confirm/:_id',{
      	templateUrl: 'app/confirm/confirm.html',
      	controller: 'ConfirmCtrl'
      });
  });
