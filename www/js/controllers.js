angular.module('starter.controllers', [])
 
.controller('FaceCtrl', function($scope, FaceService) {
 
  $scope.operation_id = "test";
 
  $scope.auth = function() {
  	$scope.operation_id = "clicked !";
  	FaceService.callApi(function(res){
  		$scope.operation_id = res.operation_id;
  	});
  };
});