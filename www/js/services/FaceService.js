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
  };
  return Face;

};

app.factory("FaceService", function($http,$ionicLoading,$ionicPopup){

  var attributes = "glass,pose,gender,age,race,smiling";

  return {

    getImgurUrl : function(imgData, callback){
      
      var req = 
      {
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          'Authorization': 'Client-ID 5f6f9c592769656'
        },
        data: { 
          'image': imgData,
          'type': 'base64'
        }
      };

      $http(req)
      .success(function(res){
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
  
      $http.jsonp(url).success(function(res){
        
        $ionicLoading.hide();

        var face = new Face();

        if(res.face.length == 0){
          console.log('No face found');
          face.smiling = 0;
          face.glass = 0;
          face.yaw = 0;
          face.roll = 0;
          face.pitch = 0;
        }
        else {
          var attr = res.face[0].attribute;
          face.smiling = attr.smiling.value;
          face.glass = attr.glass.value;
          face.yaw = attr.pose.yaw_angle.value;
          face.roll = attr.pose.roll_angle.value;
          face.pitch = attr.pose.pitch_angle.value;
        }

        callback(face);
        
      }).error(function(){
        console.log('In FaceService : cannon get face infos');
      });
    }
  };
});