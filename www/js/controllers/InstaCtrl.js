
var app= angular.module('starter');

app.controller('InstaCtrl', function($scope, InstaService, $interval, $ionicSlideBoxDelegate){
  $scope.imgcontain = 0;
  $scope.result = [];
  $scope.yolo = "Search Instagram Selfies";

  // Fix ionic slider with ng-repeat
  setTimeout(function(){
      $ionicSlideBoxDelegate.update();
      console.log('setTimeout');
  },1000);

  $scope.init = function () {
   $scope.getSelfies();
  };

  $scope.getSelfies = function() {
    InstaService.fetchSelfies(function(response){
      console.log('hello getSelfies');
      $scope.imgcontain = 1;
      $scope.img_url2 = response;
      $scope.result = response;

    });
  };
  

});