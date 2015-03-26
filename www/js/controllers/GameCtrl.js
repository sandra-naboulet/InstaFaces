var app= angular.module('starter');

app.controller('GameCtrl', function($scope, InstaService, FaceService, $interval, $ionicSlideBoxDelegate){

	$scope.init = function () {
		alert('THIS IS BEFORE CAMERA');
		$scope.openCamera();
	};
/*
  $scope.shareSelfie = function (){
    var insta = document.getElementById('ImageCapture');
    var caption = "Hey @antonin_rvr, you've been selfimitated!!! "
    $cordovaInstagram.share(insta, caption).then(function() {
      console.log('GameCtrl, share on onstagram worked');
  }, function(err) {
      console.log('No share on instagram');
  });
  };*/


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
      	  //Succes
      	  function(imgData) {
        	  var theImage = document.getElementById('ImageCapture');
        		theImage.style.display = 'block';
        		theImage.src = "data:image/jpeg;base64," + imgData;
            console.log(theImage.src);
            // Put image in canvas
            var canvas = document.getElementById('insta');
            var ctx = canvas.getContext('2d');
            var sendselfie = new Image();
            sendselfie.src = theImage.src; 
            ctx.drawImage(sendselfie, 0, 0);

            // Get image URL
            FaceService.getImgurUrl(imgData, function(res){

            	var imgUrl = res.data.link;

            	alert('In GameCtrl : url = ' + imgUrl);

                // Get Face infos
                FaceService.getFaceInfos(imgUrl, function(face){
                	console.log('glass ? ' + face.glass);
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