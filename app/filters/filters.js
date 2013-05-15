'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length))
        length = 10;

      if (end === undefined)
        end = "...";

      if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  }).
  filter('imageSize', function () {
    return function (text, size) {
      if (isNaN(size)){
        size = 'm';
      }
      var i=text.lastIndexOf(".");
      
      return String([text.slice(0, i), size, text.slice(i)].join(''));

    };
  }).
  filter('subArrays', function () {
    return function (a, b) {
      if (a == undefined){ a = []};
      if (b == undefined){ b = []};
      return a.filter(function ( name ) {
          return b.indexOf( name ) === -1;
      });
    };
  }).
  filter('rand', function () {
    return function (min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    };
  });
