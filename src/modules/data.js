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
