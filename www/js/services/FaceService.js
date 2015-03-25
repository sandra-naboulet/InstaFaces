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
 
  Face.prototype.compareWith = function (anotherFace) {
    return 42;
  };

  Face.prototype.asString = function () {
    return 'Face = { smiling : ' + this.smiling + ' glass :' + this.glass + ' pitch :' + this.pitch + ' yaw : ' + this.yaw + ' roll : '+ this.roll + '}';
  };

  return Face;

};


app.factory("FaceService", function($http,$ionicLoading,$ionicPopup){

  var attributes = "glass,pose,gender,age,race,smiling";

  return {

    getImgurUrl : function(imgData, callback){
      var req = {
         method: 'POST',
         url: 'https://api.imgur.com/3/image',
         headers: {
           'Authorization': 'Client-ID 4a54a06a9013a40'
         },
         data: { 
            'image': imgData,
            'type': 'base64'
          }

        }

        $http(req)
        .success(function(res){
            console.log('In FaceService : success');
            callback(res)
        })
        .error(function(){
            console.log('In FaceService : error');
        });
    },



    getFaceInfos : function(imgUrl, callback){

      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }
  
      var url = API_URL + "detection/detect?callback=JSON_CALLBACK&output=jsonp&url=" + encodeURIComponent(imgUrl) + "&api_secret=" + API_SECRET + "&api_key=" + API_KEY + "&attribute=" + attributes;
      console.log('url = ' + url);
      $http.jsonp(url).success(function(res){

        $ionicLoading.hide();

        if(res.face.length == 0){
           console.log('No face in the pic');
        }
        else {
          var attr = res.face[0].attribute;

          var face = new Face();
          face.smiling = attr.smiling.value;
          face.glass = attr.glass.value;
          face.yaw = attr.pose.yaw_angle.value;
          face.roll = attr.pose.roll_angle.value;
          face.pitch = attr.pose.pitch_angle.value;
          
          callback(face);
        }
        

      }).error(function(){
        console.log('Cant send the picture');
      });
    }
  };


});