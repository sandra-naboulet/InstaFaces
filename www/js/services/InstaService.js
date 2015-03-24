var app= angular.module('starter');

app.factory("InstaService", function($http,$ionicLoading,$ionicPopup){ 

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
});