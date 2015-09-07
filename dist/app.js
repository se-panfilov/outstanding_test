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

    .factory('DataFactory', function () {

        var exports = {
            data: [],
            selectedDate: null
        };

        return exports;
    })

;

'use strict';

angular.module('outstanding.calendar', [])

    .factory('CalendarFactory', function () {

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
            getMonthNumber: function (datetime) {
                var date = new Date(datetime);
                if (!exports.isUTC) {
                    return date.getMonth();
                } else {
                    return date.getUTCMonth();
                }
            },
            getMonth: function (datetime) {

            }
        };

        return exports;
    })

    .directive('calendar', ['CalendarFactory', function (CalendarFactory) {
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
