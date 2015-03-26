
var app= angular.module('starter');

app.controller('InstaCtrl', function($scope, $ionicLoading, InstaService, FaceService, $interval, $ionicSlideBoxDelegate){
  
  $scope.imgcontain = 0;
  $scope.result = [];
  $scope.yolo = "Search Instagram Selfies";
  $scope.selfies = [];
  

  // Fix ionic slider with ng-repeat
 setTimeout(function(){
      $ionicSlideBoxDelegate.update();
      console.log('setTimeout');
  },1000);

  $scope.init = function () {
    $ionicSlideBoxDelegate.update();
    $ionicLoading.show({template: 'Loading...'});
    $scope.getSelfies();
  };

  $scope.getSelfies = function() {
    
    InstaService.fetchSelfies(function(response){

      for (var i = 0; i < response.length; i++) {
        $scope.selfies.push(
          {
            img:response[i],
            desc: '#selfie hello blablab blaba ) :-*'
          }
        ); 
      }

      $ionicLoading.hide();

    });
    
      
  };

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };
  
});