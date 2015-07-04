'use strict';

angular.module('primasellertestApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $scope.user = "Pranav";

    $scope.row_labels=['A','B','C','D','E','F','G','H','I','J'];
    $scope.rows=[];

    $scope.seat_hash = [];
    $scope.user_hash = [];

    $scope.reserve = function(seat){
      //console.log("wanna reserve "+seat.name);
      if(seat.status=="selected"){
        console.log("it's selected");
      }else{
        console.log("it's not selected");
        seat.status = "selected";
      }
      $scope.seat_hash[seat.name] = $scope.user;
    }

    $scope.populate = function(row){
       row.seats = []; 
       for(var i=0;i<row.capacity;i++){
          row.seats.push({name:row.label+(i+1),status:null});
       }

       return row; 
    }

    _.forEach($scope.row_labels,function(label){
        var row = {label:label,capacity:12};
        row = $scope.populate(row);
        $scope.rows.push(row);
    });

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });


    $.backstretch('/assets/images/poster4.jpg');

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
