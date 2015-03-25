var app= angular.module('starter');

var API_KEY = "4536f3ae77864fe5fe37179e2b9d2003";
var API_SECRET = "s5e6ldgUG5QTwz_juemVaSsKiRDDw0hd";
var API_URL = "https://apius.faceplusplus.com/v2/";

var Face = function () {
 
  
  function Face() {
    this.smiling;
    this.glass;
    this.pitch;
    this.yaw;
    this.roll;
  }
 
  /**
   * Public method, assigned to prototype
   */
  Face.prototype.compareWith = function (anotherFace) {
    return 42;
  };

  return Face;
};


app.factory("FaceService", function($http,$ionicLoading,$ionicPopup){

  var base_url = "https://apius.faceplusplus.com/v2/";
  var attributes = "glass,pose,gender,age,race,smiling";
  

  return {

    getFaceInfos : function(picture, isUrl, callback){

      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }

      console.log('Start FacePPDetect...');

      faceppDetect({
        img: picture,
        type: 'dataURI',
        success: function(faces) {
            console.log("Detect Success : " + faces);
        },
        error: function() {
             console.log("Detect Error");         
        }
      });

     /* var picAttr = "";
      if(isUrl){
        picAttr = "url";
      }
      else{
        picAttr = "img[POST]";
      }
  
      var url = base_url + "detection/detect?callback=JSON_CALLBACK&output=jsonp&" + picAttr + "=" + picture + "&api_secret=" + api_secret + "&api_key=" + api_key + "&attribute=" + attributes;
    
      $http.jsonp(url).success(function(res){

        $ionicLoading.hide();

        var attr = res.face[0].attribute;

        var face = new Face();
        face.smiling = attr.smiling.value;
        face.glass = attr.glass.value;
        face.yaw = attr.pose.yaw_angle.value;
        face.roll = attr.pose.roll_angle.value;
        face.pitch = attr.pose.pitch_angle.value;
        
        callback(face);
      }).error(function(){
        console.log('Cant send the picture');
      });*/
    }
  };



function faceppDetect(options) {
       // if ($.support.cors) {
            var xhr = new XMLHttpRequest();
            xhr.timeout = 10 * 1000;
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        options.success(JSON.parse(xhr.responseText));
                    } else {
                        options.error();
                    }
                }
            };

            if (options.type === 'url') {
                xhr.open('GET', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET + '&url=' + encodeURIComponent(options.img), true);
                xhr.send();
            } else if (options.type === 'dataURI') {
                xhr.open('POST', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET, true);
                var fd = new FormData();
                fd.append('img', dataURItoBlob(options.img));
                xhr.send(fd);
            } else {
                options.error();
            }
       /* } else { // fallback to jsonp
            if (options.type === 'url') {
                $.ajax({
                    url: API_URL + 'detection/detect',
                    data: {
                        api_key: API_KEY,
                        api_secret: API_SECRET,
                        url: options.img
                    },
                    dataType: 'jsonp',
                    success: options.success,
                    error: options.error,
                    timeout: 10 * 1000
                });
            } else {
                options.error();
            }
        }*/
    };

   function dataURItoBlob(dataURI) {
  
        var binary = atob(dataURI.split(',')[1]);
  
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }

        return URL.createObjectURL(new Blob([new Uint8Array(array)] , { type: 'image/jpeg' }));
        //return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    }








});