'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('CollapseDemoCtrl', ['$scope', function($scope) {
    $scope.isCollapsed = true;
  }])
  .controller('Filters', ['$scope','$http', '$resource','Imgur', function($scope, $http, $resource, Imgur) {

    $scope.imgur = Imgur;
    
    $scope.updateFilter = function(i) {
        $scope.imgur.toggleFilter(i);
    };
    
  }]);