'use strict';

angular.module('outstanding.calendar', [])

    .directive('calendar', function () {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, elem) {
                console.log('calendar');
            }
        };
    })

;
