var app= angular.module('starter');

var API_KEY = "4536f3ae77864fe5fe37179e2b9d2003";
var API_SECRET = "s5e6ldgUG5QTwz_juemVaSsKiRDDw0hd";
var API_URL = "https://apius.faceplusplus.com/v2/";
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 var picUrl = "https://distilleryimage11-a.akamaihd.net/3769f372742411e18bb812313804a181_7.jpg";

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
                        console.log("RESPONSE : " + xhr.response);
                    }
                }
            };

            if (options.type === 'url') {
                xhr.open('GET', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET + '&url=' + encodeURIComponent(options.img), true);
                xhr.send();
            } else if (options.type === 'dataURI') {
                
                xhr.open('POST', API_URL + 'detection/detect?api_key=' + API_KEY + '&api_secret=' + API_SECRET , true);
                xhr.setRequestHeader("Content-Type", "multipart/form-data");
                var fd = new FormData();

                fd.append('img', b64toBlob(options.img));
                // fd.append('img', dataURItoBlob(options.img));
                //fd.append('img', decode(options.img));

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

// DECODE SOLUTION 1

    function b64toBlob(b64Data) {
  
      var sliceSize = 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

     // var blob = new Blob(byteArrays, { type: 'image/jpeg' });
      return byteArrays;
  };

// DECODE SOLUTION 2

   function dataURItoBlob(dataURI) {
  
        var binary = atob(dataURI);
  
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }

        return new Blob([new Uint8Array(array)] , { type: 'image/jpeg' });
  
    };


// DECODE SOLUTION 3

    function decode(input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
          }

      }

      output = utf8_decode(output);

      return output;

  };


  function utf8_decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
  };







});