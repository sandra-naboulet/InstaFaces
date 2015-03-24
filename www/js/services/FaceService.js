var app= angular.module('starter');

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
  var api_key = "4536f3ae77864fe5fe37179e2b9d2003";
  var api_secret = "s5e6ldgUG5QTwz_juemVaSsKiRDDw0hd";

  return {

    getFaceInfos : function(picture, callback){

      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }
  
      var url = base_url + "detection/detect?callback=JSON_CALLBACK&output=jsonp&url=" + picture + "&api_secret=" + api_secret + "&api_key=" + api_key + "&attribute=" + attributes;
    
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
      });


    }

  };
});