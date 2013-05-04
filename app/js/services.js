'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('Imgur', function($resource, $http) {
    
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    
    var albumsService = {};
    var albums = [];
    var images = [];
    
    var albumList = $resource('https://api.imgur.com/3/account/chop655/albums').get(function () {
        albumList.data.forEach(function (album, i) {
            album = $resource('https://api.imgur.com/3/account/chop655/album/:id',{id:album.id}).get(function () {
                albumsService.defaultFilters(album.data, i);
                albums.push(album.data);
            });
        });
    });

    albumsService.defaultFilters = function(album, i) {
        album.active=((i==0)?true:false);
        if(album.active){
            albumsService.pushImages(album.images);
        }
    };
    
    albumsService.pushImages = function(_images) {
        _images.forEach(function (image) {
            images.push(image);
        });
    };  
    
    albumsService.toggleFilter = function(i) {
        albums[i].active = (albums[i].active===false)?true:false;
    };
    
    albumsService.updateStack = function(i) {
        images.length = 0;
        albums.forEach(function (album, i) {
            if(album.active){
                albumsService.pushImages(album.images);
            }
        });
    };
    
    albumsService.albums = function() {
        return albums;
    };
    
    albumsService.images = function() {
        return images;
    };
    
    return albumsService;
  });