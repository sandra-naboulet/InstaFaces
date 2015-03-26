var app= angular.module('starter');

app.controller('ResultCtrl', function($scope, $ionicLoading, $rootScope, InstaService, FaceService, $stateParams){

  $scope.resultValue = 0;

  $scope.init = function () {

    // Camera
    $scope.openCamera();

    // Draw insta pic
    var canvas = document.getElementById('insta');
    var ctx = canvas.getContext('2d');
    var instaImg = new Image();
    instaImg.width = 100;
    instaImg.height = 100;
    instaImg.src = $rootScope.selfies[$stateParams.id].url; 

    ctx.drawImage(instaImg, 0, 0,instaImg.width,instaImg.height);

  };

  function compareFaces(face1,face2){
    var smile1 = face1.smiling;
    var glass1 = face1.glass;
    var pitch1 = face1.pitch;
    var yaw1 = face1.yaw;
    var roll1 = face1.roll;
    var width1 = face1.width;

    var smile2 = face2.smiling;
    var glass2 = face2.glass;
    var pitch2 = face2.pitch;
    var yaw2 = face2.yaw;
    var roll2 = face2.roll;
    var width2 = face2.width;

    var score_smile;
    var score_glass;
    var score_pitch;
    var score_yaw;
    var score_roll;
    var score_width;

    var final_score;

    // Echelle de smile 
    var result_smile = smile1 - smile2;
    result_smile = Math.abs(result_smile);
    if(result_smile <10){
        score_smile = 100;
    }
    else if(result_smile <20){
        score_smile = 90;
    }
    else if(result_smile <30){
        score_smile = 70;
    }
    else if(result_smile <40){
        score_smile = 50;
    }
    else if(result_smile <50){
        score_smile = 30;
    }
    else {
        score_smile = 0;
    }
    // Echelle de roll
    var result_roll = roll1 - roll2;
    result_roll = Math.abs(result_roll);
    if(result_roll <5){
        score_roll = 100;
    }
    else if(result_roll <10){
        score_roll = 80;
    }
    else if(result_roll <20){
        score_roll = 60;
    }
    else if(result_roll <30){
        score_roll = 30;
    }
    else {
        score_roll = 0;
    }
    // Echelle de yaw
    var result_yaw = yaw1 - yaw2;
    result_yaw = Math.abs(result_yaw);
    if(result_yaw <5){
        score_yaw = 100;
    }
    else if(result_yaw <10){
        score_yaw = 80;
    }
    else if(result_yaw <15){
        score_yaw = 60;
    }
    else if(result_yaw <20){
        score_yaw = 40;
    }
    else if(result_yaw <25){
        score_yaw = 30;
    }
    else {
        score_yaw = 0;
    }

    // Echelle de width
    var result_width = width1 - width2;
    result_width = Math.abs(result_width);
    if(result_width <5){
        score_width = 100;
    }
    else if(result_width <10){
        score_width = 80;
    }
    else if(result_width <15){
        score_width = 60;
    }
    else if(result_width <20){
        score_width = 40;
    }
    else if(result_width <25){
        score_width = 30;
    }
    else {
        score_width = 0;
    }

    final_score = (score_width + score_yaw + score_roll + score_smile)/4;
    //bonus glasses
    if ((glass1 === glass2) && (final_score<95)){
      final_score += 5;
    }
    if ((glass1 === glass2) && (final_score>95)){
      final_score = 100;
    }

    return final_score;

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