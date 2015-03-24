
var app= angular.module('starter');

app.controller('InstaCtrl', function($scope, InstaService){
  $scope.imgcontain = 0;
  $scope.yolo = "Search Instagram Selfies";

  $scope.getSelfies = function() {
    InstaService.fetchSelfies(function(response){
      console.log('hello');
      $scope.imgcontain = 1;
      $scope.img_url = response[0].images.standard_resolution.url;
    });
  };

});