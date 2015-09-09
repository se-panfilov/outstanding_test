'use strict';

angular.module('outstanding.data', [])

    .factory('DataFactory', function ($rootScope, MessagesFactory) {

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
                var parsed = Papa.parse(data, {skipEmptyLines: true, dynamicTyping: true});
                if (parsed.errors){
                    MessagesFactory.errorMsg('Cannot parse .csv');
                }

                return parsed.data;
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
                return parsedData[rowNum];
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
    })

;
