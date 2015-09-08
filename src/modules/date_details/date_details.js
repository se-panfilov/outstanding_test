'use strict';

angular.module('outstanding.date_details', [])

    .directive('date_details', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'date_details/date_details.html',
            link: function (scope, elem) {
                console.log('details');
            }
        };
    })

;
