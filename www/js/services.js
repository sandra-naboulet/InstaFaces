angular.module('starter.services', [])

.factory("FaceService", function($http,$ionicLoading,$ionicPopup){

  var api_key = "713dcdb3c93240209d478719decd28a8";
  var api_secret = "0e4d393bc0a848a5a54851f26367f05a";
  var operationId = "";

  return {
    callApi : function authenticate(callback){

      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }

      var url = "http://api.skybiometry.com/fc/account/authenticate?callback=JSON_CALLBACK&output=jsonp&api_key=" + api_key + "&api_secret=" + api_secret;

      $http.jsonp(url)
      .success(function(res){
        $ionicLoading.hide();
        operationId = res.operation_id;
        callback(res);
      });
    },


    getFaceInfos : function(urls, callback){

      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }

      var url = "http://api.skybiometry.com/fc/faces/detect?callback=JSON_CALLBACK&output=jsonp&api_key=" + api_key + "&api_secret=" + api_secret + "&urls="+ urls +"&attributes=all" ;

      $http.jsonp(url)
      .success(function(res){
        $ionicLoading.hide();
        var yaw = res.photos[0].tags[0].yaw;
        callback(yaw);
      });


    }

  };
})


.factory("InstaService", function($http,$ionicLoading,$ionicPopup){ 

  var clientid = "2e5abd064927444aa13fc2c5d27ef800";
  var tag = "selfie";
  var count = 1;
  return{

    fetchSelfies: function(callback) {
      var url = "https://api.instagram.com/v1/tags/"+tag+"/media/recent?client_id="+clientid+"&callback=JSON_CALLBACK";


      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }

      $http.jsonp(url).success(function(response) {
        $ionicLoading.hide();
        callback(response.data);
      });
    }


  };
})


;