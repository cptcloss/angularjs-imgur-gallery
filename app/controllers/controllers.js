'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Filters', ['$scope','Imgur', function($scope, Imgur) {
    
    $scope.$on('updateAlbumsList', function(e) {
        $scope.albumsList = Imgur.returnAlbumsList();
    });
    
    $scope.filterAlbum = function(id) {
      Imgur.filterAlbum(id);
    };
    
    $scope.init = function() {   
      Imgur.getAlbumsList(function(){
        Imgur.loadFilters();
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