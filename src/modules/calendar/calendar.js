'use strict';

angular.module('outstanding.calendar', [])

    .factory('CalendarFactory', function (DataFactory) {

        function _getDaysInMonth(month, year) {
            var date = new Date(year, month + 1, 0);
            if (!exports.isUTC) {
                return date.getDate();
            } else {
                return date.getUTCDate();
            }
        }

        function _getDays(monthNum, yearNum) {
            var result = {};
            var from = 1;
            var to = _getDaysInMonth(monthNum, yearNum);

            for (var i = from; i <= to; i++) {
                result[i] = {};
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

        function _getDayNumber(datetime) {
            var date = new Date(datetime);
            if (!exports.isUTC) {
                return date.getDate();
            } else {
                return date.getUTCDate();
            }
        }

        function getMonth(datetime) {
            var month = {
                number: _getMonthNumber(datetime),
                days: _getDays(datetime)
            };

            return month;
        }

        function _getYearNumber(datetime) {
            var date = new Date(datetime);
            if (!exports.isUTC) {
                return date.getFullYear();
            } else {
                return date.getUTCFullYear();
            }

        }

        function _getMonthList(dateTimesList, yearNum) {
            var result = {};
            for (var i = 0; i < dateTimesList.length; i++) {
                var datetime = dateTimesList[i];
                if (yearNum === _getYearNumber(datetime)) {
                    var monthNum = _getMonthNumber(datetime);
                    if (!result[monthNum]) {
                        result[monthNum] = _getDays(monthNum, yearNum);
                    }
                }
            }

            return result;
        }

        var DATE_REGEXP = new RegExp(/\d+/g);

        var exports = {
            dates: [],
            years: [],
            isUTC: false,
            setUTC: function (isUTC) {
                exports.isUTC = isUTC || false;
            },
            setDates: function (data) {
                exports.dates = [];
                var datesCol = DataFactory.getDateCol(data, true);

                for (var i = 0; i < datesCol.length; i++) {
                    var dateString = datesCol[i];
                    var parsed = dateString.match(DATE_REGEXP);
                    var date = new Date(parsed[2], parsed[1] - 1, parsed[0]);
                    exports.dates.push(date.getTime());
                }
            },
            makeYearsList: function () {
                var years = {};

                for (var i = 0; i < exports.dates.length; i++) {
                    var datetime = exports.dates[i];
                    var yearNum = _getYearNumber(datetime);
                    if (!years[yearNum]) { //TODO (S.Panfilov) what if year exist?
                        years[yearNum] = _getMonthList(exports.dates, yearNum);
                    }
                }

                exports.years = years;

            },
            insertDataToDates: function () {
                for (var i = 0; i < exports.dates.length; i++) {
                    var datetime = exports.dates[i];
                    var yearNum = _getYearNumber(datetime);//TODO (S.Panfilov) bug with -1/+1 month number
                    var monthNum = ('0' + (_getMonthNumber(datetime) + 1)).slice(-2);
                    var dayNum = ('0' + _getDayNumber(datetime)).slice(-2);
                    var dateStr = dayNum + '/' + monthNum + '/' + yearNum;//A hack cause normally should be based on regexp

                    var row = DataFactory.getRowByDateString(dateStr);

                    exports.years[+yearNum][+monthNum][+dayNum].events = exports.years[+yearNum][+monthNum][+dayNum].events || [];
                    exports.years[+yearNum][+monthNum][+dayNum].events.push(
                        {
                            contract: DataFactory.getContractVal(row),
                            time: DataFactory.getTimeVal(row),
                            amount: DataFactory.getAmountVal(row)
                        }
                    );
                }
            }
        };

        return exports;
    })

    .directive('calendar', function (CalendarFactory) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'calendar/calendar.html',
            scope: {
                source: '=',
                selected: '=',
                isUtc: '='
            },
            link: function (scope) {

                var monthNamesList = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];

                scope.getMonthName = function (num) {
                    return monthNamesList[num - 1];
                };

                scope.$watch('source', function (value, oldValue) {
                        if (!value || value === oldValue) return;
                        _init(value);
                    }
                );

                function _init(sourceData) {
                    CalendarFactory.setUTC(scope.isUtc);
                    CalendarFactory.setDates(sourceData);
                    CalendarFactory.makeYearsList();
                    CalendarFactory.insertDataToDates();
                }

                scope.CalendarFactory = CalendarFactory;

            }
        };
    })

;
