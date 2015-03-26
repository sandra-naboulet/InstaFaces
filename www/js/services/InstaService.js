var app= angular.module('starter');

app.factory("InstaService", function($http,$ionicLoading,$ionicPopup){ 

  var clientid = "c8e20f20055a4a76872b95dc5a15ff8b";
  var tag = "selfie";
  var count = 10;
  return{

    fetchSelfies: function(tagg, callback) {

      var url = "https://api.instagram.com/v1/tags/"+tagg+"/media/recent?client_id="+clientid+"&callback=JSON_CALLBACK&COUNT="+count+"";
      console.log("URL : " + url);
      if(navigator && navigator.connection && navigator.connection.type === 'none'){
        $ionicPopup.alert({
          title:'Connexion impossible',
          template:'Vous n\'etes pas connecté a Internet' 
        });
        return;
      }

      $http.jsonp(url).success(function(response) {
        callback(response.data);
      });
    }


  };
});