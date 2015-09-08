'use strict';

angular.module('outstanding', [
    //modules
    'outstanding.templates',

    //pages
    'outstanding.pages.landing',

    //factories
    'outstanding.data',

    //external libs
    'ngAnimate',
    'ui.router',
    'anim-in-out',
    'angular-loading-bar'//,
    //'ui.bootstrap',

])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/landing');
    }])
;

'use strict';

angular.module('outstanding.data', [])

    .factory('DataFactory', ['$rootScope', function ($rootScope) {

        var COLS = {
            CONTRACT: 0,
            DATE: 1,
            TIME: 2,
            AMOUNT: 3
        };

        var exports = {
            data: [],
            parsedData: [],
            selectedDate: null,
            parseData: function (data) {
                //TODO (S.Panfilov) just a mock
                return [
                    ['Contract', 'Date', 'Time', 'Amount'],
                    [14851, '20/05/2016', '12:04:78.594', 1405.61],
                    [35156, '20/05/2016', '12:37:35.298', 23415.51],
                    [29526, '22/05/2016', '15:24:31.562', 5296.15],
                    [29586, '23/05/2016', '11:27:25.158', 18150.57],
                    [56556, '04/06/2016', '09:51:21.565', 9385.19]
                ]
            },
            getCol: function (parsedData, colNum, isExcludeTitle) {
                var result = [];
                var start = (isExcludeTitle) ? 1 : 0;

                for (var i = start; i < parsedData.length; i++) {
                    var row = parsedData[i];
                    result.push(row[colNum]);
                }
                return result;
            },
            getRow: function (parsedData, rowNum) {
                return parsedData[rowNum];//TODO (S.Panfilov) unused
            },
            getContractCol: function (parsedData, isExcludeTitle) {
                return exports.getCol(parsedData, COLS.CONTRACT, isExcludeTitle);
            },
            getDateCol: function (parsedData, isExcludeTitle) {
                return exports.getCol(parsedData, COLS.DATE, isExcludeTitle);
            },
            getTimeCol: function (parsedData, isExcludeTitle) {
                return exports.getCol(parsedData, COLS.TIME, isExcludeTitle);
            },
            getAmountCol: function (parsedData, isExcludeTitle) {
                return exports.getCol(parsedData, COLS.AMOUNT, isExcludeTitle);
            },
            getRowByDateString: function (dateStr) {
                var start = 1; //exclude titles
                for (var i = start; i < exports.parsedData.length; i++) {
                    var row = exports.parsedData[i];
                    if (row[COLS.DATE] === dateStr){
                        return row;
                    }
                }

                //TODO (S.Panfilov) throw error here
            },
            getContractVal: function (row) {
                return row[COLS.CONTRACT];
            },
            getDateVal: function (row) {
                return row[COLS.DATE];
            },
            getTimeVal: function (row) {
                return row[COLS.TIME];
            },
            getAmountVal: function (row) {
                return row[COLS.AMOUNT];
            }
        };

        $rootScope.$watch(function () {
            return exports.data;
        }, function (value, oldValue) {
            if (!value || value === oldValue) return;

            exports.parsedData = exports.parseData(value);
        }, true);

        return exports;
    }])

;

'use strict';

angular.module('outstanding.calendar', [])

    .constant('DAY_EVENT_FIELDS', {
        CONTRACT: 'contract',
        AMOUNT: 'amount',
        DATE: 'date',
        TIME: 'time'
    })

    .factory('CalendarFactory', ['DataFactory', 'DAY_EVENT_FIELDS', function (DataFactory, DAY_EVENT_FIELDS) {

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
                    var event = {};

                    exports.years[+yearNum][+monthNum][+dayNum].events = exports.years[+yearNum][+monthNum][+dayNum].events || [];
                    event[DAY_EVENT_FIELDS.CONTRACT] = DataFactory.getContractVal(row);
                    event[DAY_EVENT_FIELDS.TIME] = DataFactory.getTimeVal(row);
                    event[DAY_EVENT_FIELDS.AMOUNT] = DataFactory.getAmountVal(row);
                    exports.years[+yearNum][+monthNum][+dayNum].events.push(event);
                }
            }
        };

        return exports;
    }])

    .directive('calendar', ['CalendarFactory', 'DAY_EVENT_FIELDS', function (CalendarFactory, DAY_EVENT_FIELDS) {
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

                scope.getTotalForDay = function (eventsList, fieldName) {
                    if (!eventsList) return;

                    var result = 0;
                    for (var i = 0; i < eventsList.length; i++) {
                        var event = eventsList[i];
                        result += event[fieldName];
                    }

                    return result;
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
    }])

;

'use strict';

angular.module('outstanding.date_details', [])

    .directive('date_details', function () {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, elem) {
                console.log('details');
            }
        };
    })

;

'use strict';

angular.module('outstanding.uploader', [])

    .directive('uploader', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                storage: '='
            },
            templateUrl: 'uploader/uploader.html',
            link: function (scope) {
                scope.$watch('fileContent', function (value, oldValue) {
                        if (value === oldValue) return;
                        scope.storage = value;
                    }, true
                );
            }
        };
    })

    .directive('fileReader', function () {
        return {
            scope: {
                fileReader: "="
            },
            link: function (scope, element) {
                element.on('change', function (changeEvent) {
                    var files = changeEvent.target.files;
                    if (files.length) {
                        var r = new FileReader();

                        r.onload = function (e) {
                            var contents = e.target.result;
                            scope.$apply(function () {
                                scope.fileReader = contents;
                            });
                        };

                        r.readAsText(files[0]);
                    }
                });
            }
        };
    })


;

'use strict';

angular.module('outstanding.pages.landing', [
    'outstanding.calendar',
    'outstanding.date_details',
    'outstanding.uploader',
    'ui.router'
])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'landing/landing.html',
                controller: 'LandingPageCtrl'
            })
        ;
    }])

    .controller('LandingPageCtrl', ['$scope', 'DataFactory', function ($scope, DataFactory) {

        (function _init() {
            $scope.DataFactory = DataFactory;
            $scope.isUtc = false;
        })();

    }])
;
