var app= angular.module('starter');

app.controller('FaceCtrl', function($scope, FaceService) {
 
 var picUrl = "https://distilleryimage11-a.akamaihd.net/3769f372742411e18bb812313804a181_7.jpg";
  $scope.operation_id = "test";
  $scope.yam = "yam";
 
  $scope.auth = function() {
  	$scope.operation_id = "clicked !";
  	FaceService.callApi(function(res){
  		$scope.operation_id = res.operation_id;
  	});
  };

  $scope.getFaceInfos = function() {
  	FaceService.getFaceInfos(picUrl, function(yam){
  		$scope.yam = yam;
  	});
  }

});