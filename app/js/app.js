'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap', 'infinite-scroll']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {templateUrl: 'partials/art.html'});
    $routeProvider.when('/art', {templateUrl: 'partials/art.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
