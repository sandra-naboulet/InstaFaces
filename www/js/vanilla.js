console.log('vanilla launched');
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var canvas = document.getElementById('ImageCapture');
        var ctx = canvas.getContext('2d');
        console.log('Received Event: ' + id);
    },
    share: function () {
      console.log('you are sharing this with vanillajs');
      Instagram.share('ImageCapture', 'Hey @antonin_rvr, check that selfie that i made with your pic', function (err) {
        alert('Error sharing the picture');
      });
    },
    yolo: function() {
        return alert('yolo');
    }
};

