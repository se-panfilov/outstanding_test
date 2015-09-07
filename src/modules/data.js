'use strict';

angular.module('outstanding.data', [])

    .factory('DataFactory', function ($rootScope) {

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
            getCol: function (colNum) {
                var result = [];
                for (var i = 0; i < exports.parsedData.length; i++) {
                    var row = exports.parsedData[i];
                    result.push(row[colNum]);
                }
                return result;
            },
            getContractCol: function () {
                return exports.getCol(COLS.CONTRACT);
            },
            getDateCol: function () {
                return exports.getCol(COLS.DATE);
            },
            getTimeCol: function () {
                return exports.getCol(COLS.TIME);
            },
            getAmountCol: function () {
                return exports.getCol(COLS.AMOUNT);
            }
        };

        $rootScope.$watch(function () {
            return exports.data;
        }, function watchCallback(value, oldValue) {
            if (!value || value === oldValue) return;

            exports.parsedData = exports.parseData(value);
        });

        return exports;
    })

;
