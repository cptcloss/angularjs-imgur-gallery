'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('CollapseDemoCtrl', ['$scope', function($scope) {
    $scope.isCollapsed = true;
  }])
  .controller('Filters', ['$scope','$q','Imgur','$http', function($scope, $q, Imgur, $http) {
    
    $scope.albums = [];
    $scope.results = [];
    
    $scope.getAlbumsList = function(user, callback) {
        Imgur.albumsList.get({user:user},    
            function(value) {
                $scope.albumsList = value.data;
                return callback();
            }
        );
    }

    $scope.getAlbum = function(user, id, callback) {
        var promise = Imgur.album.get({user:user, id:id},    
            function(value) {
                return callback(value.data);
            }
        );
        return promise;
    }

    $scope.getAlbums = function(user, callback) {
        var prom = [];
        $scope.albumsList.forEach(function (obj, i) {
            if((obj.active === true)&&(obj.get === false)){
                var promise =
                $scope.getAlbum(user, obj.id, function(value){
                    $scope.albums.push(value);
                });
                prom.push(promise);
            }
        });
        
        $q.all(prom).then(function () {
            callback();
        });
    };

    $scope.pushResults = function(callback) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function () {
            $scope.albums.forEach(function (obj, i) {
                if(obj.active === true) {
                    $scope.results.push(obj);
                }
                else {
                    $scope.results.pop(obj);
                }
            });
        }).then(function () {
            callback();
        });
        deferred.resolve();
    };
    
    $scope.updateResults = function(i) {
        $scope.toggleFilter(i, function(){
            $scope.pushResults(function(){
            
            });
        });
    };

    $scope.toggleFilter = function(i, callback) {
        Imgur.toggleFilter($scope.albumsList, i, function(value){
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
    
    $scope.init = function(user) {
        $scope.getAlbumsList(user, function(){
            console.log('getAlbumsList');
            console.log($scope.albumsList);
            
            $scope.pushProperties(function(){
                console.log('pushProperties');
                console.log($scope.albumsList);
                
                $scope.toggleFilter(0, function(){
                    console.log('toggleFilter');
                    console.log($scope.albumsList);

                    $scope.getAlbums(user, function(){
                        console.log('getAlbums');
                        console.log($scope.albums);
                        
                        $scope.pushResults(function(){
                           console.log('pushResults');
                           console.log($scope.results); 
                        });            
                    });
                });
            });
        });
    };

    $scope.init('chop655');
    
  }]);