var app= angular.module('starter');

app.controller('GameCtrl', function($scope, $ionicLoading, InstaService, FaceService, $interval, $ionicSlideBoxDelegate, $stateParams){

// $scope.tag = $routeParams.tag;

 $scope.imgcontain = 0;
  $scope.result = [];
  $scope.yolo = "Search Instagram Selfies";
  $scope.selfies = [];
  

  // Fix ionic slider with ng-repeat
 setTimeout(function(){
      $ionicSlideBoxDelegate.update();
      console.log('setTimeout');
  },1000);

  $scope.init = function () {
    $ionicSlideBoxDelegate.update();
    $ionicLoading.show({template: 'Loading...'});
    $scope.getSelfies();
  };

  $scope.getSelfies = function() {
    
    console.log('TAG : ' + $stateParams.tag);
    var tagg = $stateParams.tag;
    InstaService.fetchSelfies(tagg, function(response){

      var text;

      for (var i = 0; i < response.length; i++) {
        text = '';

        if(response[i].caption){
          text = response[i].caption.text;
        }
        $scope.selfies.push(
          {
            url :response[i].images.standard_resolution.url,
            desc : text.trim().substring(0,100)
          }
        ); 
      }

      $ionicLoading.hide();

    });
    
      
  };

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };
  

});