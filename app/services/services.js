'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  factory('Imgur', function($resource, $http, $q, subArraysFilter, randFilter) {
    
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    var imgurService = {};
    var albumsList = [];
    var albums = [];
    var resultsList = [];
    var results = [];
    var poolList = [];
    var pool = [];

    /**************************************************************
     *  Build Objects
     **************************************************************/
    imgurService.albumsList = function(callback) {
      $resource('https://api.imgur.com/3/account/zdepthcharge/albums').get().$then(
        function(value){
          albumsList = value.data.data;
          imgurService.pushAlbumsListProperties();
          callback();
        }
      );
    };
    
    imgurService.albums = function(callback) {
      var prom = [];
      albumsList.forEach(function (obj) {
        if((obj.active === true)&&(obj.get === false)){
          var promise = $resource('https://api.imgur.com/3/account/zdepthcharge/album/:id').get({id:obj.id}).$then(
            function(album){
              imgurService.toggleAlbumGet(obj.id);
              imgurService.pushAlbumImagesProperties(album.data.data);
              albums.push(album.data.data);
            }
          );
          prom.push(promise);
        }
      });
      $q.all(prom).then(function () {
        callback();
      });
    };

    /**************************************************************
     *  Object Filters
     **************************************************************/
    imgurService.filterByAlbum = function(ids, callback) {
      imgurService.toggleAlbumActive(ids);
      imgurService.albums(function(){
          imgurService.resultsList();
          imgurService.results();
          imgurService.popPoolImageByID();
          imgurService.pushPoolImageByID();
          imgurService.syncPoolList();
          imgurService.syncPool();
          callback();
      });
    };    
     
    /**************************************************************
     *  Object Methods
     **************************************************************/
    imgurService.resultsList = function(callback) {
      resultsList.length = 0;
      albumsList.forEach(function (obj) {
        if((obj.active === true)&&(obj.get === true)) {
          resultsList.push(obj.id);
        }
      });
    };

    imgurService.results = function(callback) {
      results.length = 0;
      albums.forEach(function (obj) {
        resultsList.forEach(function(result) {
          if(obj.id == result){
            results.push(obj);
          }
        });
      });
    };
    
    imgurService.syncPoolList = function() {
      var copy = resultsList.slice(0);
      poolList = copy;
    };
    
    imgurService.syncPool = function() {
      var poolCount = 0;
      var x = pool.length-1;
      pool.forEach(function(image){
        if(image.pool === false){
          poolCount ++;
        }
      });
      var remPossible = (poolCount<20?poolCount:20);
      var i = 0;
      while(i<remPossible){
        var z = randFilter(0,x);
        if(pool[z].pool===false){
          pool[z].pool = true;
          i++;
        };
      }
    };
    
    imgurService.toggleAlbumGet = function(id) {
      albumsList.forEach(function (obj) {
        if(obj.id == id){
          obj.get = true;
        }
      });
    };

    imgurService.pushAlbumImagesProperties = function(album) {
      album.images.forEach(function (image) {
          image.pool=false;
          image.albumID=album.id;
          image.albumTitle=album.title;
      });
    };

    imgurService.pushAlbumsListProperties = function() {
      albumsList.forEach(function (obj) {
          obj.active=false;
          obj.get=false;
      });
    };
    
    imgurService.toggleAlbumActive = function(ids) {
      if (ids == undefined){
          ids = [];
          albumsList.forEach(function (obj) {
              ids.push(obj.id);
          });
      };
      if( typeof ids === 'string' ) {
          ids = [ids];
      }
      ids.forEach(function (id) {
          albumsList.forEach(function (obj) {
              if(obj.id == id){
                  obj.active = (obj.active===false)?true:false;
              }
          });
      });
    };

    imgurService.popPoolImageByID = function() {
      var popList = subArraysFilter(poolList, resultsList);
      for(var i = 0; i < pool.length; i++) {
        var obj = pool[i];
        if(popList.indexOf(obj.albumID) !== -1) {
          pool.splice(i, 1);
          i--;
        }
      }
    };

    imgurService.pushPoolImageByID = function() {
      var pushList = subArraysFilter(resultsList, poolList);
      results.forEach(function (album) {
        album.images.forEach(function (image) {
          pushList.forEach(function (albumID) {
            if(image.albumID == albumID){
              pool.push(image);
            }
          });
        });
      });
    };
    
    /**************************************************************
     *  Return Objects
     **************************************************************/
    imgurService.returnAlbumsList = function() {
      return albumsList;
    };
    
    imgurService.returnAlbums = function() {
      return albums;
    };

    imgurService.returnResultsList = function() {
      return resultsList;
    };

    imgurService.returnResults = function() {
      return results;
    };

    imgurService.returnPoolList = function() {
      return poolList;
    };

    imgurService.returnPool = function() {
      return pool;
    };
    
    return imgurService;
  });