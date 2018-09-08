/*
 *** DO NOT MODIFY THE COPYRIGHT HEADER MANUALLY ***
 * Copyright (c) Optum 2015 - All Rights Reserved.
 *** Release process will update accordingly ***
 * @version 3.12.0
 */
(function () {
    var uitkIconFont = function($sce) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                icon: '@',
                hiddenText: '@',
                iconText: '@',
                model: '='
            },
            link: function($scope, $element) {
                // use htmlTemplate if it exists, otherwise use iconText
                if ($scope.model && $scope.model.htmlTemplate && !$scope.iconText) {
                    $scope.trustedHtmlTemplate = $sce.trustAsHtml($scope.model.htmlTemplate);
                } else if ($scope.iconText) {
                    $scope.trustedHtmlTemplate = $scope.iconText;
                }
            },
            template: '<span class="tk-icon"><span aria-hidden="true" class="tk-icon-glyph"><span class="{{icon}}" style="font-weight: bold;"></span></span><span class="html-template" uitk-compile-template ng-if="model && model.htmlTemplate"></span><span class="html-template" ng-bind-html="trustedHtmlTemplate" ng-if="!model && iconText"></span><span ng-if="hiddenText" class="oui-a11y-hidden">{{hiddenText}}</span></span>'
        };
    };

    var uitkCompileTemplate = function($compile) {
        return function($scope, $element) {
            $scope.$watch('trustedHtmlTemplate', function() {
                $compile($scope.model.htmlTemplate)($scope, function(clone) {
                    $element.empty();
                    $element.append(clone);
                });
            });
        };
    };

    angular.module('uitk.component.uitkIconFont', [])
        .directive('uitkIconFont', ['$sce', uitkIconFont])
        .directive('uitkCompileTemplate', ['$compile', uitkCompileTemplate]);
})();
