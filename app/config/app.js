'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap', 'infinite-scroll']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {templateUrl: 'views/art.html'});
    $routeProvider.when('/bio', {templateUrl: 'views/bio.html'});
    $routeProvider.when('/contact', {templateUrl: 'views/contact.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
