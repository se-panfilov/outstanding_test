'use strict';

angular.module('outstanding.calendar', [])

    .constant('DAY_EVENT_FIELDS', {
        CONTRACT: 'contract',
        AMOUNT: 'amount',
        DATE: 'date',
        TIME: 'time'
    })

    .constant('DAYS_OF_WEEK', [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun'
    ])

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
                        result[monthNum] = _getDays(monthNum - 1, yearNum);
                    }
                }
            }

            return result;
        }

        var DATE_REGEXP = new RegExp(/\d+/g);

        function parseDateStr(data, cb) {
            var datesCol = DataFactory.getDateCol(data, true);

            for (var i = 0; i < datesCol.length; i++) {
                var dateString = datesCol[i];
                var parsed = dateString.match(DATE_REGEXP);
                var date = new Date(parsed[2], parsed[1] - 1, parsed[0]);
                if (cb) cb(date.getTime(), parsed);
            }
        }

        var exports = {
            dates: [],
            years: [],
            isUTC: false,
            setUTC: function (isUTC) {
                exports.isUTC = isUTC || false;
            },
            setDates: function (data) {
                exports.dates = [];
                parseDateStr(data, function (date) {
                    exports.dates.push(date);
                })
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
            insertDataToDates: function (data) {
                var start = 1; //beacuse 0 - is a title row
                for (var i = start; i < data.length; i++) {
                    var row = data[i];
                    var event = {};

                    var dateString = DataFactory.getDateVal(row);
                    var parsed = dateString.match(DATE_REGEXP);
                    var date = new Date(parsed[2], parsed[1] - 1, parsed[0]);
                    var datetime = date.getTime();

                    var yearNum = '' + _getYearNumber(datetime);
                    var monthNum = ('0' + _getMonthNumber(datetime, true)).slice(-2);
                    var dayNum = ('0' + _getDayNumber(datetime)).slice(-2);

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
            },
            getDayOfWeek: function (monthNum, yearNum) {
                var result;
                var date = new Date(+yearNum, +monthNum -1, 1);
                if (!exports.isUTC) {
                    result =  date.getDay();
                } else {
                    result =  date.getUTCDay();
                }

                var days = [6,0,1,2,3,4,5];//this is a hack to makes week start from Mon (btw can be refactored)
                return days[result];
            }
        };

        return exports;
    })

    .directive('calendar', function (CalendarFactory, DAY_EVENT_FIELDS, DAYS_OF_WEEK) {
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
                    CalendarFactory.insertDataToDates(sourceData);
                }

                (function _init() {
                    scope.CalendarFactory = CalendarFactory;
                    scope.DAY_EVENT_FIELDS = DAY_EVENT_FIELDS;
                    scope.DAYS_OF_WEEK = DAYS_OF_WEEK;
                })();

            }
        };
    })

;
