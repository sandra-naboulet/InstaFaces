// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngRoute', 'ngCordova']);

app.run(function($ionicPlatform, $ionicPopup, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
  if(window.cordova && window.cordova.plugins.Keyboard) {
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
  }
  if(window.StatusBar) {
    StatusBar.styleDefault();
  } 

  });
})

/*
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
  /*.state('login', {
    url: '/',
    templateUrl: '/partials/login.html',
    controller: 'LoginCtrl'
  })
  .state('menu', {
    url: '/',
    templateUrl: '/partials/menu.html',
    controller: 'MenuCtrl'
  })
  .state('game', {
    url: '/game',
    templateUrl: '/partials/game.html',
     controller: 'InstaCtrl' // Rename to GameCtrl ?
  })
})*/
/*
app.config(function($routeProvider){
  $routeProvider
  .when('/menu', {templateUrl: 'partials/menu.html'})
  .when('/game', {templateUrl: 'partials/game.html'})
  .otherwise({redirectTo: '/menu'})
});
*/
var app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
  .state('menu', {
    url: '/',
    templateUrl: 'partials/menu.html',
  })
  .state('game', {
    url: '/game',
    templateUrl: 'partials/game.html',
    controller: 'InstaCtrl'
  })
  .state('result', {
    url: '/result',
    templateUrl: 'partials/result.html',
    controller: 'GameCtrl'
  })
})

