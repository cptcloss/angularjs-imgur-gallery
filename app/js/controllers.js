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
    $scope.pool = [];
    $scope.poolList = [];
    
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
                    $scope.toggleAlbumGet(obj.id, function(){
                        $scope.pushAlbumImagesProperties(album, function(value){
                            $scope.albums.push(value);
                        });
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
    
    $scope.subArrays = function(a, b){
        if (a == undefined){ a = []};
        if (b == undefined){ b = []};
        return a.filter(function ( name ) {
            return b.indexOf( name ) === -1;
        });
    }

    $scope.popPoolImageByID = function(callback) {
        var popList = $scope.subArrays($scope.poolList, $scope.resultsList);
        
        for(var i = 0; i < $scope.pool.length; i++) {
            var obj = $scope.pool[i];
        
            if(popList.indexOf(obj.albumID) !== -1) {
                $scope.pool.splice(i, 1);
                i--;
            }
        }
        (callback?callback():null);
    };
    
    $scope.pushPoolImageByID = function(callback) {
        var pushList = $scope.subArrays($scope.resultsList, $scope.poolList);
        $scope.results.forEach(function (album) {
            album.images.forEach(function (image) {
                pushList.forEach(function (albumID) {
                    if(image.albumID == albumID){
                        $scope.pool.push(image);
                    }
                });
            });
        });
        (callback?callback():null);
    };
    
    $scope.syncPoolResults = function(callback) {
        $scope.popPoolImageByID(function(){
            $scope.pushPoolImageByID(function(){
                var copy = $scope.resultsList.slice(0);
                $scope.poolList = copy;
                (callback?callback():null);
            });        
        });
    };
    
    $scope.rand = function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $scope.disPool = function(callback) {    
        var poolCount = 0;
        var x = $scope.pool.length-1;
        $scope.pool.forEach(function(image){
            if(image.pool === false){
                poolCount ++;
            }
        });
        var remPossible = (poolCount<20?poolCount:20);
        var i = 0;
        while(i<remPossible){
            var z = $scope.rand(0,x);
            console.log(z)
            if($scope.pool[z].pool===false){
                $scope.pool[z].pool = true;
                i++;      
            };
        }
        (callback?callback():null);
    };
    
    $scope.pushImages_EvenDis = function(callback) {
        $scope.syncPoolResults(function(){
            $scope.disPool(function(){
                return (callback?callback():null);
            });            
        });
    };
    
    $scope.updateResults = function(ids, callback) {
        $scope.toggleAlbumActive(ids, function(){
            $scope.getAlbums(function(){
                $scope.pushResultsList(function(){
                    $scope.pushResults(function(){
                        // Even Distribution
                        $scope.pushImages_EvenDis(function(){
                            (callback?callback():null);
                        });                   
                        
                        // First In First Out
                        //$scope.pushImages_FIFO(function(){
                        //
                        //});
                    });
                });
            });
        });
    };

    $scope.toggleAlbumActive = function(ids, callback) {
        Imgur.toggleAlbumActive($scope.albumsList, ids, function(value){
            $scope.albumsList = value;
            (callback?callback():null);
        });
    };

    $scope.toggleAlbumGet = function(id, callback) {
        Imgur.toggleAlbumGet($scope.albumsList, id, function(value){
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

    $scope.init = function(callback) {
        $scope.getAlbumsList(function(){
            $scope.pushAlbumsListProperties(function(){
                return (callback?callback():null);
            });
        });
    };

    $scope.init(function(){
        // Config stuff goes here!
        $scope.updateResults(null, function(){

        });
    });
  }]);