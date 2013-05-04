'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive("myDirective", function() {
      return {
          restrict: 'E'
      };
  })
  .directive('checkLast', function () {
          return function (scope, element, attrs) {
              
              if (scope.$last=== true) { //wait for last item in the iterator
                  element.ready(function () {
                     $('#container').masonry({ columnWidth: 60});
                      
                  })
              }
          }
      });