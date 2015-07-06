'use strict';

angular.module('primasellertestApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location) {
    $scope.awesomeThings = [];

    $scope.loaded = false;

    //username
    $scope.username = "";
    //number seats required by the user
    $scope.seats_required;

    $scope.row_labels=['A','B','C','D','E','F','G','H','I','J'];
    $scope.rows=[];

    $scope.seat_hash = [];
    $scope.user_hash = [];

    $scope.seats_selected = [];


    

    $scope.user_data;


    $scope.selecting = false;
    $scope.just_selected = false;


    //flattens hash to array

    $scope.flatten=function(hash){
      var flattened = [];
      for(var key in hash){
        var flat = {key : key,value:[]};
        for(var i=0; i<hash[key].length; i++){
          flat.value.push(hash[key][i]);
        }
        flattened.push(flat);

      }

      $scope.user_data = flattened;
    }




    $scope.status=function(name){
      if($scope.seat_hash[name]!==undefined && $scope.seat_hash[name]!==""){
        console.log("this seat is reserved");
        return "reserved";
      }else{
        console.log("this seat is not reserved");
        return null;
      }
    }

    $scope.populate = function(){
    
    _.forEach($scope.row_labels,function(label){
        var row = {label:label,capacity:12};
       
        row.seats = [];
    
        for(var i=0;i<row.capacity;i++){
           var name = row.label + (i+1);
           row.seats.push({name: name, status: $scope.status(name)});
        }
        
        $scope.rows.push(row);
    });
     
    }







    $scope.init=function(data){
      
      for(var i=0;i<data.length;i++){
        console.log(data[i].username);
        $scope.user_hash[data[i].username] = $scope.user_hash[data[i].username] || [];
        
        for(var j=0;j<data[i].seats.length;j++){
          $scope.user_hash[data[i].username].push(data[i].seats[j].name);

        }
      }

      
      for(var key in $scope.user_hash){
        for(var k=0;k<$scope.user_hash[key].length;k++){
          console.log($scope.user_hash[key][k]);
          $scope.seat_hash[$scope.user_hash[key][k]] = key;
        }
      }

      console.log($scope.user_hash);

      
      $scope.populate();

      $scope.flatten($scope.user_hash);


    }




    $scope.reserve = function(){
      if($scope.seats_selected.length == $scope.seats_required){
         $scope.user_hash[$scope.username] = $scope.user_hash[$scope.username] || []; 

         for(var i=0; i<$scope.seats_selected.length; i++){
            $scope.user_hash[$scope.username].push($scope.seats_selected[i]);   
         }

         for(var j=0; j<$scope.seats_selected.length; j++){
            $scope.seat_hash[$scope.seats_selected[j].name] = $scope.username;
         };

         console.log($scope.user_hash);

         $http.post('/api/reservations',{username:$scope.username,seats:$scope.seats_selected})
          .success(function(data,status,config,headers){
            console.log(data);
            $scope.just_selected = true;
            $scope.selecting = false;
            $location.url('/confirm/'+data._id);

          })

      }
      else{
        console.log("select more seats");
      }
    }

    
    $scope.select = function(seat){

      if(seat.status!=="reserved"){
    
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

    }



    $scope.fetch = function(){
      $http.get('/api/reservations')
        .success(function(data,status,config,headers){
          console.log(data);
          $scope.init(data);
        });
    };

    $scope.fetch();

    
    
      

    $.backstretch('/assets/images/poster4.jpg');

  });
