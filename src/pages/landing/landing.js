'use strict';

angular.module('outstanding.pages.landing', [
    'outstanding.calendar',
    'outstanding.details',
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

    .controller('LandingPageCtrl', function ($scope) {

        console.log('landing');
        
    })
;
