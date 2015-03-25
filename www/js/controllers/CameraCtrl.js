var app= angular.module('starter');

app.controller('CameraCtrl', function($scope, FaceService, InstaService) {
  
  var picUrl = "https://distilleryimage11-a.akamaihd.net/3769f372742411e18bb812313804a181_7.jpg";
  $scope.picGlass = "--";


  $scope.openCamera = function() {

  
  if (!navigator.camera) {
      alert("Camera API not supported", "Error");
      return;
  }
  var options =   {   quality: 50,
                      destinationType: Camera.DestinationType.FILE_URI,
                      sourceType: Camera.PictureSourceType.CAMERA, // 0:Photo Library, 1=Camera, 2=Saved Album
                      encodingType: 0     // 0=JPG 1=PNG
                  };

  navigator.camera.getPicture(
      function(imgData) {
        console.log("Get picture : " + imgData)
         // $('.media-object', this.$el).attr('src', "data:image/jpeg;base64,"+imgData);
         FaceService.getFaceInfos(imgData, false, function(face){
            $scope.glass = face.glass;
            alert('Lunettes ? ' + face.glass,'infos');
         });
      },
      function() {
          alert('Error taking picture', 'Error');
          console.log('error get pic');
      },
      options);

  return false;
},

  $scope.compare = function() {
  	
  }

});