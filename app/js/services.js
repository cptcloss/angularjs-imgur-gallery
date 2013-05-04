'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('Imgur', function($resource, $http) {
    
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    
    //Heavy payload GIF testing
    //user: somethingthatdescribesme
    
    var albumsService = {};
    var albums = [];
    var albumList = $resource('https://api.imgur.com/3/account/gigablox/albums').get(function () {
        albumList.data.forEach(function (album, i) {
            album.active = ((i==0)?true:false);
            console.log(album);
            album = $resource('https://api.imgur.com/3/account/gigablox/album/:id',{id:album.id}).get(function () {
                albums.push(album.data);
            });
        });
    });
    
    albumsService.toggleFilter = function(i) {
        albumList.data[i].active = (albumList.data[i].active===false)?true:false;
    };
    
    albumsService.albumList = function() {
        return albumList;
    };

    albumsService.albums = function() {
        return albums;
    };   
/*
    albumsService.getAlbumImages = function() {
        $resource('https://api.imgur.com/3/account/somethingthatdescribesme/albums',{},{}).get();
    };
    
    albumsService.addItem = function(item) {
        items.push(item);
    };
    albumsService.removeItem = function(item) {
        var index = items.indexOf(item);
        items.splice(index, 1);
    };

*/
    return albumsService;
  });