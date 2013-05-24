'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  factory('Imgur', function($resource, $http, $q, $rootScope, subArraysFilter, randFilter) {
    
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    var imgurService = {};
    var albumsList = [];
    var albums = [];
    var poolList = [];
    var pool = [];
    var filter = ["v6mxV", "Xx3EL"]; //needs to get abstracted out to config level.

    /**************************************************************
     *  Build Objects
     **************************************************************/
    imgurService.getAlbumsList = function(callback) {
      $resource('https://api.imgur.com/3/account/zdepthcharge/albums').get().$then(
        function(value){
          albumsList = value.data.data;
          imgurService.pushAlbumsListProperties(value.data.data);
          $rootScope.$broadcast('updateAlbumsList');
          callback();
        }
      );
    };
    
    imgurService.getAlbums = function() {
      var prom = [];
      albumsList.forEach(function (album) {
        if(!imgurService.recieveAlbum(album.id) && (album.active == true)){
          var promise = $resource('https://api.imgur.com/3/account/zdepthcharge/album/:id').get({id:album.id}).$then(
            function(value){
              imgurService.pushAlbumImagesProperties(value.data.data);
              albums.push(value.data.data);
            }
          );
          prom.push(promise);
        }
      });
      $q.all(prom).then(function () {
        imgurService.popPoolImageByID();
        imgurService.pushPoolImageByID();
        imgurService.syncPoolList();
        imgurService.syncPool();
        $rootScope.$broadcast('updatePool');
      });
    };

    /**************************************************************
     *  Object Filters
     **************************************************************/
    imgurService.loadFilters = function() {
      imgurService.loadAlbumFilter();
      imgurService.getAlbums();
    };
    
    imgurService.filterAlbum = function(id) {
      imgurService.toggleAlbumActive(id);
      imgurService.updateAlbumFilter();
      imgurService.getAlbums();
    };    
     
    /**************************************************************
     *  Object Methods
     **************************************************************/
    imgurService.returnAlbumsIdsList = function() {
      var albumsIdsList = [];
      albumsList.forEach(function(album){
        albumsIdsList.push(album.id);
      });
      return albumsIdsList;
    };
    
    
    imgurService.recieveAlbum = function(id) {
      var status = false;
      albums.forEach(function(album){
        if(album.id === id){
          status = true;
        }
      });
      return status;
    };

    imgurService.syncPoolList = function() {
      var copy = imgurService.probeActive();
      poolList = copy;
    };
    
    imgurService.probeActive = function() {
      var active = [];
      albumsList.forEach(function(album){
        if(album.active === true){
          active.push(album.id);
        }
      });
      return active;
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

    imgurService.pushAlbumImagesProperties = function(album) {
      album.images.forEach(function (image) {
          image.pool=false;
          image.albumID=album.id;
          image.albumTitle=album.title;
      });
    };

    imgurService.pushAlbumsListProperties = function() {
      albumsList.forEach(function (album){
        album.active = false;
      });
    };

    imgurService.loadAlbumFilter = function() {
      if(filter.length == 0){
        albumsList[0].active = true;
        filter.push(albumsList[0].id);
      }
      else{
        albumsList.forEach(function (album) {
          filter.forEach(function (id) {
            if(id == album.id){
              album.active = true;
            }
          });
        });
      }
    };

    imgurService.updateAlbumFilter = function() {
      filter.length = 0;
      albumsList.forEach(function (obj) {
        if(obj.active === true){
          filter.push(obj.id);
        }
      });
    };
    
    imgurService.toggleAlbumActive = function(id) {
      albumsList.forEach(function (obj) {
          if(obj.id == id){
            obj.active = (obj.active===false)?true:false;
          }
      });
    };

    imgurService.popPoolImageByID = function() {
      var active = imgurService.probeActive();
      var popList = subArraysFilter(poolList, active);
      for(var i = 0; i < pool.length; i++) {
        var obj = pool[i];
        if(popList.indexOf(obj.albumID) !== -1) {
          pool.splice(i, 1);
          i--;
        }
      }
    };

    imgurService.pushPoolImageByID = function() {
      var active = imgurService.probeActive();
      var pushList = subArraysFilter(active, poolList);
      albums.forEach(function (album) {
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
    
    imgurService.returnPoolList = function() {
      return poolList;
    };

    imgurService.returnPool = function() {
      return pool;
    };
    
    return imgurService;
  });