'use strict';

angular.module('primasellertestApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    //username
    $scope.username = "Pranav";
    //seats required by the user
    $scope.seats_required = 3;

    $scope.row_labels=['A','B','C','D','E','F','G','H','I','J'];
    $scope.rows=[];

    $scope.seat_hash = [];
    $scope.user_hash = [];

    $scope.seats_selected = [];


    $scope.reserve = function(){
      if($scope.seats_selected.length == $scope.seats_required){
         $scope.user_hash[$scope.username] = $scope.user_hash[$scope.username] || []; 

         for(var i=0; i<$scope.seats_selected.length; i++){
            $scope.user_hash[$scope.username].push($scope.seats_selected[i]);   
         }

         for(var j=0; j<$scope.seats_selected.length; j++){
            $scope.seat_hash[$scope.seats_selected[j].name] = $scope.username;
         };
      }
      else{
        console.log("select more seats");
      }
    }

    
    $scope.select = function(seat){
    
      if(seat.status == "selected"){
        $scope.seats_selected.splice(_.indexOf($scope.seats_selected,seat),1);
        seat.status = null;

      }else{
        if($scope.seats_selected.length<$scope.seats_required){
          seat.status = "selected";
          $scope.seats_selected.push(seat);
        }
      }

      console.log($scope.seats_selected);

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
