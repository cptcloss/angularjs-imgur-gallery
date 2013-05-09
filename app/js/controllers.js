'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('CollapseDemoCtrl', ['$scope', function($scope) {
    $scope.isCollapsed = true;
  }])
  .controller('Filters', ['$scope','$q','Imgur', function($scope, $q, Imgur) {
    
    $scope.albums = [];
    $scope.albumsList = [];
    $scope.results = [];
    $scope.resultsList = [];
    $scope.images = [];
    
    $scope.getAlbumsList = function(callback) {
        Imgur.albumsList.get(    
            function(value) {
                $scope.albumsList = value.data;
                return callback();
            }
        );
    }

    $scope.getAlbum = function(id, callback) {
        var promise = Imgur.album.get({id:id}).$promise.then(
            function( value ){
                return callback(value.data);
            },
            function( error ){
                
            }
        )
        return promise;
    }

    $scope.getAlbums = function(callback) {
        var prom = [];
        $scope.albumsList.forEach(function (obj, i) {
            if((obj.active === true)&&(obj.get === false)){
                var promise =
                $scope.getAlbum(obj.id, function(value){
                    $scope.albums.push(value);
                    obj.get = true;
                });
                prom.push(promise);
            }
        });
        
        $q.all(prom).then(function () {
            callback();
        });
    };

    $scope.pushResultsList = function(callback) {
        $scope.resultsList.length = 0;
        var prom = [];
        $scope.albumsList.forEach(function (obj, i) {
            if((obj.active === true)&&(obj.get === true)) {
                var promise = 
                $scope.resultsList.push(obj.id);
                prom.push(promise);
            }
        });
        $q.all(prom).then(function () {
            callback();
        });
    };

    $scope.pushResults = function(callback) {
        $scope.results.length = 0;
        var prom = [];
        $scope.albums.forEach(function (obj, i) {
            $scope.resultsList.forEach(function (result, i) {
                if(obj.id == result){
                    var promise = 
                    $scope.results.push(obj);
                    prom.push(promise);
                }
            });
        });
        $q.all(prom).then(function () {
            callback();
        });
    };

    $scope.pushImages = function(callback) {
        $scope.images.length = 0;
        var prom = [];
        $scope.results.forEach(function (obj) {
            obj.images.forEach(function (image) {
                var promise = 
                $scope.images.push(image);
                prom.push(promise);
            });
        });
        $q.all(prom).then(function () {
            callback();
        });
    };
    
    $scope.updateResults = function(id) {
        $scope.toggleFilter(id, function(){
            $scope.getAlbums(function(){
                $scope.pushResultsList(function(){
                    $scope.pushResults(function(){
                        $scope.pushImages(function(){
                            
                        });
                    });
                });
            });
        });
    };

    $scope.toggleFilter = function(id, callback) {
        Imgur.toggleFilter($scope.albumsList, id, function(value){
            $scope.albumsList = value;
            callback();
        });
    };
    
    
    $scope.pushProperties = function(callback) {
        Imgur.pushProperties($scope.albumsList, function(value){
            $scope.albumsList = value;
            callback();
        });
    };
    
    $scope.loadMore = function() {
      var last = $scope.images[$scope.images.length - 1];
      for(var i = 1; i <= 8; i++) {
        $scope.images.push(last + i);
      }
    };
  
    $scope.init = function(callback) {
        $scope.getAlbumsList(function(){
            $scope.pushProperties(function(){
                callback();
            });
        });
    };

    $scope.init(function(){
        // Config stuff goes here!
        //$scope.updateResults('hnNol', function(){

        //});
    });
    
  }]);