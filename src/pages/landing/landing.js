'use strict';

angular.module('outstanding.pages.landing', [
    'outstanding.calendar',
    'outstanding.date_details',
    'outstanding.uploader',
    'ui.router'
])

    .config(function ($stateProvider) {

        $stateProvider
            .state('landing', {
                url: '/landing',
                templateUrl: 'landing/landing.html',
                controller: 'LandingPageCtrl'
            })
        ;
    })

    .controller('LandingPageCtrl', function ($scope, DataFactory) {

        $scope.data = {};

        (function _init() {
            $scope.DataFactory = DataFactory;
        })();

    })
;
