'use strict';

angular.module('outstanding.calendar', [])

    .constant('DAY_EVENT_FIELDS', {
        CONTRACT: 'contract',
        AMOUNT: 'amount',
        DATE: 'date',
        TIME: 'time'
    })

    .constant('MONTH_NAMES', [
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
    ])

    .factory('CalendarFactory', function (DataFactory, DAY_EVENT_FIELDS, MONTH_NAMES) {

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

        function _getMonthNumber(datetime, isUserView) {
            var date = new Date(datetime);
            var result;
            if (!exports.isUTC) {
                result = date.getMonth();
            } else {
                result = date.getUTCMonth();
            }

            result += (isUserView) ? 1 : 0;
            return result;
        }

        function _getDayNumber(datetime) {
            var date = new Date(datetime);
            if (!exports.isUTC) {
                return date.getDate();
            } else {
                return date.getUTCDate();
            }
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
                    var monthNum = _getMonthNumber(datetime, true);
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
                    var monthNum = ('0' + _getMonthNumber(datetime, true)).slice(-2);
                    var dayNum = ('0' + _getDayNumber(datetime)).slice(-2);
                    var dateStr = dayNum + '/' + monthNum + '/' + yearNum;//A hack cause normally should be based on regexp

                    //TODO (S.Panfilov) BUG: we cannot act like so (take strings by date), because of same date events
                    var row = DataFactory.getRowByDateString(dateStr);
                    var event = {};

                    exports.years[+yearNum][+monthNum][+dayNum].events = exports.years[+yearNum][+monthNum][+dayNum].events || [];
                    event[DAY_EVENT_FIELDS.CONTRACT] = DataFactory.getContractVal(row);
                    event[DAY_EVENT_FIELDS.TIME] = DataFactory.getTimeVal(row);
                    event[DAY_EVENT_FIELDS.AMOUNT] = DataFactory.getAmountVal(row);
                    exports.years[+yearNum][+monthNum][+dayNum].events.push(event);
                }
            },
            getTotalForDay: function (eventsList, fieldName) {
                if (!eventsList) return;

                var result = 0;
                for (var i = 0; i < eventsList.length; i++) {
                    var event = eventsList[i];
                    result += event[fieldName];
                }

                return result;
            },
            getMonthName: function (num) {
                return MONTH_NAMES[num - 1];
            }
        };

        return exports;
    })

    .directive('calendar', function (CalendarFactory, DAY_EVENT_FIELDS) {
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

                scope.setSelectedDate = function (day, month, year) {
                    scope.selected = {
                        day: day,
                        month: month,
                        year: year,
                        data: CalendarFactory.years[year][month][day]
                    };
                };

                scope.$watch('source', function (value, oldValue) {
                        if (!value || value === oldValue) return;
                        initFactory(value);
                    }
                );

                function initFactory(sourceData) {
                    CalendarFactory.setUTC(scope.isUtc);
                    CalendarFactory.setDates(sourceData);
                    CalendarFactory.makeYearsList();
                    CalendarFactory.insertDataToDates();
                }

                (function _init() {
                    scope.CalendarFactory = CalendarFactory;
                    scope.DAY_EVENT_FIELDS = DAY_EVENT_FIELDS;
                })();

            }
        };
    })

;
