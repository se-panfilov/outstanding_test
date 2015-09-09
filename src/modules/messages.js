'use strict';

angular.module('outstanding.messages', ['toaster'])

    .factory('MessagesFactory', function (toaster) {

        var _messageTypes = {
            success: 'success',
            error: 'error',
            info: 'info',
            warning: 'warning',
            wait: 'wait'
        };

        var _messagesTitles = {
            error: 'Error'
        };

        var exports = {
            successMsg: function (message, title) {
                title = title || null;

                toaster.pop(_messageTypes.success, title, message);
            },
            errorMsg: function (message, title) {
                title = title || _messagesTitles.error;

                toaster.pop(_messageTypes.error, title, message);
            },
            infoMsg: function (message, title) {
                toaster.pop(_messageTypes.info, title, message);
            }
       };

        return exports;
    })
;