'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Filters', ['$scope','Imgur', function($scope, Imgur) {
    $scope.filterByAlbum = function(ids) {
      Imgur.filterByAlbum(ids);
    };
    $scope.init = function() {   
      Imgur.albumsList(function(){
        $scope.albumsList = Imgur.returnAlbumsList();
        $scope.filterByAlbum();
      });
    };
    $scope.init();
  }]).
  controller('Results', ['$scope','Imgur', function($scope, Imgur) {
    $scope.$on('updatePool', function(e) {
        $scope.pool = Imgur.returnPool();
    });
    $scope.getMore = function() {
      Imgur.syncPool();
    };
  }]);