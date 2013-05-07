'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').
  factory('Imgur', function($resource, $http) {
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = 'Client-ID 0823c1380a41001';
    return {
        albumsList : $resource('https://api.imgur.com/3/account/:user/albums'),
        album : $resource('https://api.imgur.com/3/account/:user/album/:id'),
        pushProperties : function (albumsList, callback) {
            albumsList.forEach(function (obj) {
                obj.active=false;
                obj.get=false;
            });
            return callback(albumsList);
        },
        toggleFilter : function (albumsList, i, callback) {
            albumsList[i].active = (albumsList[i].active===false)?true:false;
            return callback(albumsList);
        }
    }
  });