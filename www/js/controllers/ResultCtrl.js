var app= angular.module('starter');

app.controller('ResultCtrl', function($scope, FaceService) {
 // smile + glass
 var picUrl = "https://distilleryimage11-a.akamaihd.net/3769f372742411e18bb812313804a181_7.jpg";
 // smile 
 var picUrl2 = "https://distilleryimage10-a.akamaihd.net/910a3f1a8ba111e1a9f71231382044a1_7.jpg";

  $scope.result = "test";

  $scope.getResult = function(face1, face2) {
    return face1.compareWith(face2);
  },

  $scope.share = function(url1, url2) {
    
  },

  $scope.next = function() {
   
  },

  $scope.retry = function() {
    
  }

});