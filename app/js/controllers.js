'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('CollapseDemoCtrl', ['$scope', function($scope) {
    $scope.isCollapsed = true;
  }])
  .controller('Filters', ['$scope','$http', '$resource','Imgur', function($scope, $http, $resource, Imgur) {
    //$http.defaults.useXDomain = true;
    //$http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    $scope.imgur = Imgur;
  }]);