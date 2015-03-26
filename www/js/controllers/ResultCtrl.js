var app= angular.module('starter');

app.controller('ResultCtrl', function($scope, $ionicLoading, $rootScope, InstaService, FaceService, $stateParams){

  $scope.resultValue = 0;

  $scope.init = function () {

    // Camera
    $scope.openCamera();

    // Draw insta pic
    var canvas = document.getElementById('insta');
    var ctx = canvas.getContext('2d');
    var sendselfie = new Image();
    sendselfie.src = $rootScope.selfies[$stateParams.id].url; 
    ctx.drawImage(sendselfie, 0, 0);

  };

  function compareFaces(face1,face2){
    return 42;
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
                      encodingType: Camera.EncodingType.JPEG,
                      targetWidth: 720, 
                      cameraDirection: 1,
                      encodingType: 0     // 0=JPG 1=PNG
                  };

    navigator.camera.getPicture(
         
      function(imgData) {

        $ionicLoading.show({template: 'Comparison ...'});

        var theImage = document.getElementById('ImageCapture');
        theImage.style.display = 'block';
        theImage.src = "data:image/jpeg;base64," + imgData;

        FaceService.getImgurUrl(imgData, function(res){

          var imgUrl = res.data.link;
          
          FaceService.getFaceInfos(imgUrl, function(myFace){

              var instaImgUrl = $rootScope.selfies[$stateParams.id].url;

              FaceService.getFaceInfos(instaImgUrl, function(instaFace){
                 
                $scope.resultValue = compareFaces(myFace,instaFace);
                $ionicLoading.hide();
                
              });
          });

        });

      },
      //Error
      function() {
        console.log('In GameCtrl : error ');
      },
      //Options
      options);

    return false;
  };
});