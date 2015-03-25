
var app= angular.module('starter');

app.controller('InstaCtrl', function($scope, InstaService, FaceService, $interval, $ionicSlideBoxDelegate){
  $scope.imgcontain = 0;
  $scope.result = [];
  $scope.yolo = "Search Instagram Selfies";

  // Fix ionic slider with ng-repeat
  setTimeout(function(){
      $ionicSlideBoxDelegate.update();
      console.log('setTimeout');
  },1000);

  $scope.init = function () {
   $scope.getSelfies();
  };

  $scope.getSelfies = function() {
    InstaService.fetchSelfies(function(response){
      console.log('hello getSelfies');
      $scope.imgcontain = 1;
      $scope.img_url2 = response;
      $scope.result = response;

    });
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

            // Get image URL
             FaceService.getImgurUrl(imgData, function(res){
               
                var imgUrl = res.data.link;

                console.log('In InstaCtrl : url = ' + imgUrl);

                // Get Face infos
                FaceService.getFaceInfos(imgUrl, function(face){
                  console.log(face.asString());
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