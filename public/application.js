// Invoke 'strict' JavaScript mode
"use strict";

// Set the main application name
var mainApplicationModuleName = "covfefe";

// Create the main application
var mainApplicationModule = angular.module(mainApplicationModuleName, [
  "ngResource",
  "ngRoute",
  "example",
  "users",
  "articles",
  "items",
  "orders",
  "statistics",
  "chart.js"
]);

// Configure the hashbang URLs using the $locationProvider services
mainApplicationModule.config([
  "$locationProvider",
  "ChartJsProvider",
  function($locationProvider, ChartJsProvider) {
    $locationProvider.hashPrefix("!");
    ChartJsProvider.setOptions("global", { defaultFontFamily: "Nunito" });
  }
]);

mainApplicationModule.run(function($window, $rootScope) {
  $rootScope.online = navigator.onLine;
  $window.addEventListener(
    "offline",
    function() {
      $rootScope.$apply(function() {
        $rootScope.online = false;
      });
    },
    false
  );
  $window.addEventListener(
    "online",
    function() {
      $rootScope.$apply(function() {
        $rootScope.online = true;
      });
    },
    false
  );
});

// Fix Facebook's OAuth bug
if (window.location.hash === "#_=_") window.location.hash = "#!";

// Manually bootstrap the AngularJS application
angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});
