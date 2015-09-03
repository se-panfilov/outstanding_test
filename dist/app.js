'use strict';

angular.module('outstanding', [
    //modules
    'outstanding.templates',

    //pages
    'outstanding.pages.landing',

    //factories

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

    .controller('LandingPageCtrl', ['$scope', function ($scope) {

        console.log('landing');
        
    }])
;

'use strict';

angular.module('outstanding.calendar', [])

    .directive('calendar', function () {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, elem) {
                console.log('calendar');
            }
        };
    })

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

angular.module('app.files.uploader', ['app.files.factory'])

    .directive('fileUploader', ['FilesFactory', function (FilesFactory) {
        return {
            restrict: 'A',
            templateUrl: 'files/files-uploader.html',
            link: function (scope, element, attrs) {
                //TODO (S.Panfilov) should refactor with isolated scope and throw errors
                scope.fileAccept = (attrs.fileAccept) ? attrs.fileAccept : '*/*';
                scope.fileUploadBtnDesc = (attrs.fileUploadBtnDesc) ? attrs.fileUploadBtnDesc : '';
                scope.fileUploader = attrs.fileUploader;
                scope.fileUploadFiledName = attrs.fileUploadFiledName;

                var callbackHandler = scope.$eval(attrs.fileUploaderCallback);

                var handler = function (event) {
                    var files = event.target.files;
                    if (files.length === 0) return;

                    FilesFactory.initFilesUpload(scope.fileUploader, files, scope.fileUploadFiledName, callbackHandler);
                };

                element.bind('change', handler);
            }
        };
    }])
;
'use strict';

angular.module('outstanding.files.factory', [])

    .factory('FilesFactory', ['urlMap', 'MessagesFactory', '$timeout', 'HTTP_STATUS', function (urlMap, MessagesFactory, $timeout, HTTP_STATUS) {

        var _messages = {
            successFileUploadComplete: 'File successful uploaded',
            errorFileUpload: 'Uploading error',
            infoUploadCanceled: 'Uploaded cancelled',
            invalidFileError: 'Unprocessed file'
        };

        var uploadEvents = {
            progress: 'progress',
            load: 'load',
            error: 'error',
            abort: 'abort'
        };

        function prepareFiles(files, fieldName) {
            var formData = new FormData();

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append(fieldName, file);
            }

            return formData;
        }

        var exports = {
            uploadProgress: 0,
            files: [],
            fieldName: 'file',
            setFiles: function (files) {
                exports.files = [];
                for (var i = 0; i < files.length; i++) {
                    exports.files.push(files[i]);
                }
            },
            clearFiles: function () {
                exports.files = [];
            },
            makeFilesUpload: function (url, callback) {
                var formData = prepareFiles(exports.files, exports.fieldName);

                var method = 'POST';
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener(uploadEvents.progress, uploadProgressHandler, false);
                xhr.addEventListener(uploadEvents.load, uploadCompleteHandler, false);
                xhr.addEventListener(uploadEvents.error, uploadFailedHandler, false);
                xhr.addEventListener(uploadEvents.abort, uploadCanceledHandler, false);
                xhr.open(method, url);
                xhr.onload = function (event) {
                    showMessageToUser(event);
                    exports.cleanUpAfterUpload();
                    if (callback) callback(event, isError(this.status));
                };
                xhr.send(formData);
            },
            initFilesUpload: function (url, files, fieldName, callback) {
                if (fieldName) {
                    exports.fieldName = fieldName;
                }
                exports.setFiles(files);
                exports.makeFilesUpload(url, callback);
            },
            cleanUpAfterUpload: function () {
                exports.uploadProgress = 0;
                exports.clearFiles();
            }
        };

        function isError(status) {
            var firstErrorCode = 400;
            return (status >= firstErrorCode);

        }

        function showMessageToUser(event) {
            var delay = 1000;
            var status = event.target.status;

            $timeout(function () {
                if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
                    MessagesFactory.errorMsg(_messages.invalidFileError);
                } else if (isError(status)) {
                    MessagesFactory.statusErrorMsg(status);
                } else {
                    MessagesFactory.successMsg(_messages.successFileUploadComplete);
                }
            }, delay);

        }

        function uploadProgressHandler(evt) {
            if (evt.lengthComputable) {
                exports.uploadProgress = Math.round(evt.loaded * 100 / evt.total);
            } else {
                exports.uploadProgress = '???';
            }
        }

        function uploadCompleteHandler(evt) {
            //var delay = 1000;
            //$timeout(function () {
            //    MessagesFactory.successMsg(_messages.successFileUploadComplete);
            //}, delay);
        }

        function uploadFailedHandler(evt) {
            var delay = 1000;
            $timeout(function () {
                MessagesFactory.errorMsg(_messages.errorFileUpload);
            }, delay);
        }

        function uploadCanceledHandler(evt) {
            var delay = 1000;
            $timeout(function () {
                MessagesFactory.infoMsg(_messages.infoUploadCanceled);
            }, delay);
        }

        return exports;

    }])
;


'use strict';

angular.module('outstanding.uploader', [])

    .directive('uploader', function () {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, elem) {
                console.log('uploader');
            }
        };
    })

;
