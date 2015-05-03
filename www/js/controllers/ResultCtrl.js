var app= angular.module('starter');

app.controller('ResultCtrl', function($scope, $ionicLoading, $rootScope, InstaService, FaceService, $stateParams){

  $scope.resultValue = '';
  $scope.username = $rootScope.selfies[$stateParams.id].username;

  // Passer des paramètres du scope dans notre fonction native
  // pour plugin instagram
  $scope.share = function() {
    app2.share($scope.resultValue, $scope.username);
  }
  $scope.init = function () {
    //$ionicLoading.show('Process ...');
    // Camera
    $scope.openCamera();

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
                var theImage = document.getElementById('ImageCapture');
               theImage.src = "data:image/jpeg;base64," + imgData;
               var theWidth = $('#ImageCapture').width();
               var theHeight = $('#ImageCapture').height();
               // Put image in canvas
               var canvas = document.getElementById('insta');
               var ctx = canvas.getContext('2d');
               canvas.width = theWidth/2;
               canvas.height = theHeight/3;

               // Draw our selfie
               var sendselfie = new Image();
               sendselfie.width = theWidth;
               sendselfie.height = theHeight;
               sendselfie.src = theImage.src; 
               ctx.drawImage(sendselfie, 0, 0, theWidth/2, theHeight/2);

               // Draw insta pic
               var instaImg = new Image();
               instaImg.width = 120;
               instaImg.height = 120;
               instaImg.src = $rootScope.selfies[$stateParams.id].url; 
               ctx.drawImage(instaImg, 12, 12,(instaImg.width/2),(instaImg.height/2));


        FaceService.getImgurUrl(imgData, function(res){

          var imgUrl = res.data.link;
          
          FaceService.getFaceInfos(imgUrl, function(myFaces){

              var instaImgUrl = $rootScope.selfies[$stateParams.id].url;

              FaceService.getFaceInfos(instaImgUrl, function(instaFaces){

                 
                 if(myFaces.length === 0 || instaFaces.length === 0){
                    console.log('No face detected on at least one of the 2 pictures. Cant compare them.');
                    alert('No face detected on at least one of the 2 pictures. Cant compare them. Retry.');
                 } 
                 else{

                    var faces1 = [];
                    var faces2 = [];
                    var res;
                    var results = [];

                    if(myFaces.length < instaFaces.length){
                        faces1 = myFaces;
                        faces2 = instaFaces;
                    }
                    else{
                        faces1 = instaFaces;
                        faces2 = myFaces;
                    }

                    for (var i = 0; i < faces1.length; i++) {
                        res = compareFaces(faces1[i], faces2[i]);
                        results.push(res);
                    }


                 }
                 // TODO Update scope. les resultats sont dans results[]
                console.log('faces1 ' + myFaces.length + ' faces2' + instaFaces.length);

                for (var i = 0; i < results.length; i++) {
                    $scope.resultValue += results[i] + '% ';
                }
               
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