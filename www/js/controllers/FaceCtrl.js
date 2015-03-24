var app= angular.module('starter');

app.controller('FaceCtrl', function($scope, FaceService) {
 // smile + glass
 var picUrl = "https://distilleryimage11-a.akamaihd.net/3769f372742411e18bb812313804a181_7.jpg";
 // smile 
 var picUrl2 = "https://distilleryimage10-a.akamaihd.net/910a3f1a8ba111e1a9f71231382044a1_7.jpg";

  $scope.operation_id = "test";
  $scope.smiling = "--";
  $scope.glass = "--";
  $scope.yaw = "--";
  $scope.roll = "--";
  $scope.pitch = "--";

  $scope.getFaceInfosFromBinary = function() {
  	FaceService.getFaceInfos(picUrl2, false, function(face){
  		$scope.yaw = face.yaw;
      $scope.smiling = face.smiling;
      $scope.glass = face.glass;
      $scope.roll = face.roll;
      $scope.pitch = face.pitch;
  	});
  },

  $scope.getFaceInfosFromUrl = function() {
    FaceService.getFaceInfos(picUrl2, true, function(face){
      $scope.yaw = face.yaw;
      $scope.smiling = face.smiling;
      $scope.glass = face.glass;
      $scope.roll = face.roll;
      $scope.pitch = face.pitch;
    });
  }

});