var app = angular.module('starter');

app.controller('GameCtrl', function($scope, $location, $rootScope, $ionicLoading, InstaService, FaceService, $interval, $ionicSlideBoxDelegate, $stateParams){
  
  $rootScope.selfies = [];
  
 

  $scope.init = function () {
    $ionicSlideBoxDelegate.update();
    $ionicLoading.show({template: 'Loading...'});
    $scope.getSelfies();
  };

  $scope.getSelfies = function() {
    
    var tag = $stateParams.tag;

    InstaService.fetchSelfies(tag, function(response){

      var text;

      for (var i = 0; i < response.length; i++) {
        text = '';

        if(response[i].caption){
          text = response[i].caption.text;
        }

        $rootScope.selfies.push(
          {
            url :response[i].images.standard_resolution.url,
            username : response[i].user.username,
            desc : text.trim().substring(0,100)
          }
        ); 
      }
      // Fix ionic slider with ng-repeat
      $ionicSlideBoxDelegate.update();
      $ionicLoading.hide();
      

    });

  };
  

  $scope.takeSelfie = function() {
    $location.path('/result/' +  $ionicSlideBoxDelegate.currentIndex());
  };

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  };

});