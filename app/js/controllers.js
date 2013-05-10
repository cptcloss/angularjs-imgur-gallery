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
    $scope.maxImagesPerLoad = 10;
    
    $scope.getAlbumsList = function(callback) {
        Imgur.albumsList.get(    
            function(value) {
                $scope.albumsList = value.data;
                return (callback?callback():null);
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
                $scope.getAlbum(obj.id, function(album){
                    $scope.pushAlbumImagesProperties(album, function(value){
                        $scope.albums.push(value);
                        obj.get = true;
                    });
                });
                prom.push(promise);
            }
        });
        
        $q.all(prom).then(function () {
            (callback?callback():null);
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
            (callback?callback():null);
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
            (callback?callback():null);
        });
    };

    $scope.pushImages_FIFO = function(callback) {
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
            (callback?callback():null);
        });
    };
    
    $scope.pushImages_EvenDis = function(callback) {
        $scope.getMaxAlbumsImages();
        $scope.getDisNum();
        
        // If the number of albums is greater than the number of images per request:
        // - randomize album selection each time.
        // 
        //      ::: POOL PARTY!!!
        //
        //      * albums must addProperties(pool,albumID,title) to all images                           <------------------ Done
        //      * pool invoked on page load after albums are pushed to results
        //      * Sync poolList and resultsList
        //          - diff poolList & resultsList
        //          - pushList[]
        //          - popList[]
        //          - http://jsfiddle.net/gigablox/rZ5fS/
        
        //      * fn() = images.push(random(pool, numImagesPerLoad)); images in pool (que = false)
        //      * ++ total available
        //      * next data call
        //      * fn();
        //      * update filter, remove pool 1
        //      * foreach pool.image pop image with album (id)
        //      * update filter, add pool 11
        //      * push album images into pool
        
        //$scope.maxImagesPerAlbum = ($scope.maxImagesPerLoad<resultsList.length?1:2)
    };

    $scope.getDisNum = function(callback) {
        $scope.maxAlbumsImages = 0;
        $scope.results.forEach(function (album, i) {
            $scope.maxAlbumsImages += album.images_count;
        });
        (callback?callback():null);
    };
    
    $scope.getMaxAlbumsImages = function(callback){
        $scope.maxAlbumsImages = 0;
        $scope.results.forEach(function (album, i) {
            $scope.maxAlbumsImages += album.images_count;
        });
        (callback?callback():null);
    };

    /*
    $scope.getMaxAlbumImages = function(callback){
        $scope.maxAlbumImages = 0;
        $scope.album.forEach(function (album, i) {
            $scope.maxAlbumImages.push(album.images_count);
        });
    };
    */
    
    $scope.updateResults = function(id, callback) {
        $scope.toggleAlbumActive(id, function(){
            $scope.getAlbums(function(){
                $scope.pushResultsList(function(){
                    $scope.pushResults(function(){
                        // Even Distribution Algorithm
                        //$scope.pushImages_EvenDis(function(){
                        //});                   
                        
                        // First In First Out Agorithm
                        //$scope.pushImages_FIFO(function(){
                        //
                        //});

                        return (callback?callback():null);
                    });
                });
            });
        });
    };

    $scope.toggleAlbumActive = function(id, callback) {
        Imgur.toggleAlbumActive($scope.albumsList, id, function(value){
            $scope.albumsList = value;
            (callback?callback():null);
        });
    };

    $scope.pushAlbumsListProperties = function(callback) {
        Imgur.pushAlbumsListProperties($scope.albumsList, function(value){
            $scope.albumsList = value;
            return (callback?callback():null);
        });
    };

    $scope.pushAlbumImagesProperties = function(album, callback) {
        Imgur.pushAlbumImagesProperties(album, function(value){
            return (callback?callback(value):null);
        });
    };
    
    // loadMore() :::
    // Not Yet implimented, will be used for infinite scroll!
    $scope.loadMore = function() {
      var last = $scope.images[$scope.images.length - 1];
      for(var i = 1; i <= 8; i++) {
        $scope.images.push(last + i);
      }
    };

    $scope.init = function(callback) {
        $scope.getAlbumsList(function(){
            $scope.pushAlbumsListProperties(function(){
                return (callback?callback():null);
            });
        });
    };

    $scope.init(function(){
        // Config stuff goes here!
        $scope.updateResults('g7mv8', function(){
            
        });
    });

  }]);