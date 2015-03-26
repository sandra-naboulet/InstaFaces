
var app= angular.module('starter');

app.controller('InstaCtrl', function($scope, $ionicLoading, InstaService, FaceService, $interval, $ionicSlideBoxDelegate){
  
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
    
    InstaService.fetchSelfies(function(response){

      for (var i = 0; i < response.length; i++) {
        $scope.selfies.push(
          {
            img:response[i],
            desc: '#selfie hello blablab blaba ) :-*'
          }
        ); 
      }

      $ionicLoading.hide();

    });
    
      
  };

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };


  $scope.openCamera = function() {
  
    if (!navigator.camera) {
        alert("Camera API not supported", "Error");
        return;
    }

    var options =   

      {   quality: 50,
          destinationType: Camera.DestinationType.DATA_URL, // FILE_URI or DATA_URL
          sourceType: Camera.PictureSourceType.CAMERA, // 0:Photo Library, 1=Camera, 2=Saved Album
          cameraDirection: 1,
          encodingType: 0     // 0=JPG 1=PNG
      };

      navigator.camera.getPicture(

          function(imgData) {
            
             FaceService.getImgurUrl(imgData, function(res){
               
                var imgUrl = res.data.link;

                FaceService.getFaceInfos(imgUrl, function(face){
                  
                  // TODO

                });

             });
          },
          function() {
             console.log('In InstaCtrl : error ');
          },
        options);

      return false;
  };
  

});