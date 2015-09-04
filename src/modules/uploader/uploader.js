'use strict';

angular.module('outstanding.uploader', [])

    .directive('uploader', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'uploader/uploader.html',
            link: function (scope) {
                scope.$watch('fileContent', function (value) {
                        console.info(value);
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
            link: function (scope, element, attrs) {
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
