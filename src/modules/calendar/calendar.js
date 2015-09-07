'use strict';

angular.module('outstanding.calendar', [])

    .factory('CalendarFactory', function () {


        function _getDays(datetime) {

            var result = [];

            for (var i = from; i <= to; i++) {
                result.push({num: i});
            }

            return result;
        }

        function _getMonthNumber(datetime) {
            var date = new Date(datetime);
            if (!exports.isUTC) {
                return date.getMonth();
            } else {
                return date.getUTCMonth();
            }
        }

        function getMonth(datetime) {
            var month = {
                number: _getMonthNumber(datetime),
                days: _getDays(datetime)
            };

            return month;
        }

        var exports = {
            dates: [],
            months: [],
            isUTC: false,
            setUTC: function (isUTC) {
                exports.isUTC = isUTC || false;
            },
            setDates: function (data) {
                //TODO (S.Panfilov)
                //get dates col
                //make datetime from strings
                //set export.dates = [123123, 1232132, 3432432]
            },
            makeMonthsList: function () {

            }
        };

        return exports;
    })

    .directive('calendar', function (CalendarFactory) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                source: '=',
                selected: '=',
                isUtc: '='
            },
            link: function (scope) {

                scope.calendarData = {
                    monthsList: []
                };

                scope.$watch('source', function (value, oldValue) {
                        if (value || value === oldValue) return;
                        _init(value);
                    }, true
                );

                function _init(sourceData) {
                    CalendarFactory.setUTC(scope.isUtc);
                    CalendarFactory.setDates(sourceData);
                }


            }
        };
    })

;
