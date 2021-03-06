var app= angular.module('starter');

app.factory("InstaService", function($http,$ionicLoading,$ionicPopup){ 

 // var clientid = "c8e20f20055a4a76872b95dc5a15ff8b";
 var clientid = "2e5abd064927444aa13fc2c5d27ef800";
  var count = 10;

  return {

    fetchSelfies: function(tag, callback) {

      var url = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?client_id=" + clientid + "&callback=JSON_CALLBACK&COUNT=" + count + "";
  
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