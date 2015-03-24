angular.module('starter.controllers', [])
 
.controller('FaceCtrl', function($scope, FaceService) {
 
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

})


.controller('InstaCtrl', function($scope, InstaService){
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