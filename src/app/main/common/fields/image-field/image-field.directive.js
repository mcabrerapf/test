(function ()
{
    'use strict';

    angular
        .module('app.common')
        .directive('imageField', imageFieldDirective);

    /** @ngInject */
    function imageFieldDirective($compile, $http, $templateCache)
    {
        return {
            restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: '@',
				label: '@',
				id: '@',
                path: '@',
				value: '=ngModel',
			},
			link: function($scope, $element, $attrs, controllers) {

				$scope.$watch('value', function(newValue, oldValue) {
					controllers[0].$setViewValue(newValue);	
				});


				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
                    $scope.currentMode = newMode + '-mode';
					show(newMode);
				});


				function generateElement(html) {
					var newElement = $compile(html)($scope);
					$element.replaceWith(newElement);
					$element = newElement;

					$scope.modelCtrl = controllers[0];
					$scope.required = false;
					if ($attrs.required) $scope.required = true;
					if ($attrs.ngRequired) $scope.ngRequired = $attrs.ngRequired;
				};


				function show(mode) {

                    // $http.get('app/main/common/fields/image-field/image-field-' + mode + '.html', {cache: $templateCache}).success(function(html) {
                    $http.get('app/main/common/fields/image-field/image-field.html', {cache: $templateCache}).success(function(html) {
                        generateElement(html);
                    });
				};


                $scope.changeImage = function() {

                    alert('change image');

                }
            }
        };
    }
})();
