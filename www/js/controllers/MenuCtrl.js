var app = angular.module('starter');

app.controller('MenuCtrl', function($scope, $location) {

	$scope.title = "Insta'Faces";

	$scope.goToSoloGame = function(){
		console.log('solo');
		//$location.path("#/game");
	},

	$scope.goToDuoGame = function(){
		console.log('duo');
	}

});