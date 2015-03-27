// Fonctionnement du plugin instagram en VanillaJS, le support via ng-cordova
// ayant été ajouté en début de semaine, et semblait encore trop instable
// Ceci est donc une solution temporaire pour faire fonctionner le plugin
console.log('vanilla launched');
var app2 = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app2.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var canvas = document.getElementById('insta');
        var ctx = canvas.getContext('2d');
        console.log('Received Event: ' + id);
    },
    share: function (score, caption) {
      var legende = 'Hey, @'+caption+', I just imitated your selfie with Faces app, my score is '+score+'/100 !! #Selfimitation';
      Instagram.share('insta', legende, function (err) {
      });
  },
  verify: function() {
    Instagram.isInstalled(function (err, installed) {
        if (installed) {
        console.log("Instagram is", installed); // installed app version on Android
    } else {
        console.log("Instagram is not installed");
    }
});
}
};

app2.initialize();


