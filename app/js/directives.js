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
        elem.masonry({ itemSelector: '.masonry-brick'});
        // Opitonal Params, delimited in class name like:
        // class="masonry:70;"
        //elem.masonry({ itemSelector: '.masonry-item', columnWidth: 140, gutterWidth: $parse(attrs.masonry)(scope) });
      }
    };     
  })
  .directive('masonryBrick', function ($compile) {
    return {
      restrict: 'AC',
      link: function (scope, elem, attrs) {
        scope.$watch('$index',function(v){
          elem.imagesLoaded(function () {
            elem.parents('.masonry').masonry('reload');
          });
        });
      }
    };    
  });