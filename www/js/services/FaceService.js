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
    this.width;
  }
 
  Face.prototype.compareWith = function (anotherFace) {
    var smile1 = this.smiling;
    var glass1 = this.glass;
    var pitch1 = this.pitch;
    var yaw1 = this.yaw;
    var roll1 = this.roll;
    var width1 = this.width;

    var smile2 = anotherFace.smiling;
    var glass2 = anotherFace.glass;
    var pitch2 = anotherFace.pitch;
    var yaw2 = anotherFace.yaw;
    var roll2 = anotherFace.roll;
    var width2 = anotherFace.width;

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

  Face.prototype.toString = function faceToString() {
    var str = 'Face = { smiling : ' + this.smiling + ' glass :' + this.glass + ' pitch :' + this.pitch + ' yaw : ' + this.yaw + ' roll : '+ this.roll + '}';
    return str;
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
           'Authorization': 'Client-ID 5f6f9c592769656'
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