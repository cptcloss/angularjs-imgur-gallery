'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ui.bootstrap']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    //"Note that an alternative way to define controllers is via the $route service."
    //If youre controller is already declared in youre view, there's no need to do it here again.
    
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {templateUrl: 'partials/art.html'});
    $routeProvider.when('/art', {templateUrl: 'partials/art.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
