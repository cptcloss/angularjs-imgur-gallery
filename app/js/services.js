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
        albumsList : $resource('https://api.imgur.com/3/account/HamsterYi/albums'),
        album : $resource('https://api.imgur.com/3/account/HamsterYi/album/:id'),
        pushProperties : function (albumsList, callback) {
            albumsList.forEach(function (obj) {
                var a = "active";
                var b = false;
                var c = "get";
                var d = false;
                
                obj[a]=b;
                obj[c]=d;
                //obj.active=false;
                //obj.get=false;
            });
            return callback(albumsList);
        },
        toggleFilter : function (albumsList, id, callback) {
            albumsList.forEach(function (obj) {
                if(obj.id == id){
                    obj.active = (obj.active===false)?true:false;
                }
            });
            return callback(albumsList);
        }
    }
  });