'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive("masonry", function($parse) {
    return {
      restrict: 'AC',
      link: function (scope, elem, attrs) {
        elem.masonry({ itemSelector: '.masonry-item', columnWidth: $parse(attrs.masonry)(scope) });
      }
    };     
  })
  .directive('masonryItem', function ($compile) {
    return {
      restrict: 'AC',
      link: function (scope, elem, attrs) {
        elem.html($compile(elem.html().trim())(scope));
        elem.imagesLoaded(function () {      
          elem.parents('.masonry').masonry('reload');
        });
      }
    };    
  });