'use strict';

angular.module('outstanding.uploader', [])

    .directive('uploader', function () {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, elem) {
                console.log('uploader');
            }
        };
    })

;
