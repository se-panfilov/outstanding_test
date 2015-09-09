'use strict';

angular.module('outstanding.date_details', [
    'outstanding.calendar'
])

    .directive('dateDetails', function (CalendarFactory, DAY_EVENT_FIELDS) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                source: '='
            },
            templateUrl: 'date_details/date_details.html',
            link: function (scope) {

                scope.CalendarFactory = CalendarFactory;
                scope.DAY_EVENT_FIELDS = DAY_EVENT_FIELDS;
            }
        };
    })

    .filter('pureTime', function () {
        return function (timeStr) {
            var start = 0;
            var separator = '.';
            return timeStr.substr(start, timeStr.lastIndexOf(separator));
        };
    })
;
