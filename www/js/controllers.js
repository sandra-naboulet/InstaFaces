angular.module('starter.controllers', [])
 
.controller('PictureCtrl', function($scope, SkyBiometryService) {
 
  $scope.operation_id = "test";
 
  $scope.authenticate = function() {
  	$scope.operation_id = "clicked !";
  	SkyBiometryService.callApi(function(res){
  		$scope.operation_id = res.operation_id;
  	});
  };
});