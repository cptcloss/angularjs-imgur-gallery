'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('Filters', ['$scope','Imgur', function($scope, Imgur) {
  
    $scope.filterByAlbum = function(ids) {
      Imgur.filterByAlbum(ids, function(){});
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

    $scope.getMore = function() {
      Imgur.syncPool();
    };

    $scope.init = function() {   
      $scope.pool = Imgur.returnPool();
    };

    $scope.init();
  }]);