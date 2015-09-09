'use strict';

angular.module('outstanding', [
    //modules
    'outstanding.templates',
    'outstanding.messages',

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

    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/landing');
    })
;
