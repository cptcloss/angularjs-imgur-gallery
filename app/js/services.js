'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  factory('Imgur', function($resource, $http) {
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    return {
        albumsList : $resource('https://api.imgur.com/3/account/zdepthcharge/albums'),
        album : $resource('https://api.imgur.com/3/account/zdepthcharge/album/:id'),
        pushAlbumsListProperties : function (albumsList, callback) {
            albumsList.forEach(function (obj) {
                obj.active=false;
                obj.get=false;
            });
            return callback(albumsList);
        },
        pushAlbumImagesProperties : function (album, callback) {
            album.images.forEach(function (image) {
                image.pool=false;
                image.albumID=album.id;
                image.albumTitle=album.title;
            });
            return callback(album);
        },
        toggleAlbumActive : function (albumsList, ids, callback) {
            if (ids == undefined){
                ids = [];
                albumsList.forEach(function (obj) {
                    ids.push(obj.id);
                });
            };
            if( typeof ids === 'string' ) {
                //var temp = ids;
                ids = [ids];
                //ids.push(temp);
            }
            ids.forEach(function (id) {
                albumsList.forEach(function (obj) {
                    if(obj.id == id){
                        obj.active = (obj.active===false)?true:false;
                    }
                });
            });
            return callback(albumsList);
        },
        toggleAlbumGet : function (albumsList, id, callback) {
            albumsList.forEach(function (obj) {
                if(obj.id == id){
                    obj.get = true;
                }
            });
            return callback(albumsList);
        }
    }
  });