'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('Imgur', function($resource, $http) {
    
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    var images = {};
    var albumsService = {};
    var albums = $resource('https://api.imgur.com/3/account/somethingthatdescribesme/albums').get();

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
/*
    return {
        albums: function() {
            return $resource('https://api.imgur.com/3/account/somethingthatdescribesme/albums',{},{});
        }
        
        images: function() {
            return $resource('https://api.imgur.com/3/account/somethingthatdescribesme/album/:id',{},{});
        }
        
    }
*/

  });