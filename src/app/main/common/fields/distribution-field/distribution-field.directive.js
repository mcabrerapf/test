(function ()
{
    'use strict';

    angular
        .module('app.common')
        .directive('distributionField', distributionFieldDirective);

    /** @ngInject */
    function distributionFieldDirective($compile, $http, $templateCache, $timeout, api)
    {
        return {
            restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: '@',
				label: '@',
				value: '=ngModel'
			},
			link: function($scope, $element, $attrs, controllers) {

				$scope.params = {};

				controllers[0].$formatters.push(function(newValue) {

					if (newValue === undefined) {
						$scope.value = [];
					}

					$scope.params.participants = newValue.length;
					setParamValues();
					//$scope.params.first = newValue[0] || 0;
					//$scope.params.last = newValue[newValue.length - 1] || 0;
					//$scope.params.total = getTotalPoints(newValue);

					$timeout(function() {
						$scope.chart.resize();
					}, 200);
				});

				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
                    $scope.currentMode = newMode + '-mode';
					show(newMode);
				});


				$scope.$watch('params.distribution', function(newValue, oldValue) {
					if (newValue === undefined || newValue === '') return;
					var distribution = getDistributionById(newValue);
					$scope.params.participants = distribution.participants;
					$scope.value = distribution.distributionTable;
					setParamValues();
				});

				$scope.$watch('params.participants', function(newValue, oldValue) {
					if (newValue === undefined) return;
					generateDistributionTable();
				});
				$scope.$watch('params.first', function(newValue, oldValue) {
					if (newValue === undefined) return;
					generateDistributionTable();
				});
				$scope.$watch('params.last', function(newValue, oldValue) {
					if (newValue === undefined) return;
					generateDistributionTable();
				});



				api.distributions.find({type:'Points'}, function(distributions) {
					$scope.distributions = distributions;
				});

				$scope.options = {
					series: getTableData(),
					legend: {
						visible: false
					},
					categoryAxis: {
						visible: true,
						categories: generateCategoryAxisArray(),
						line: {
							visible: false
						}
					},
					tooltip: {
						visible: true,
						format: "{0}%",
						template: "#= dataItem.index #: #= dataItem.value #"
					}
				};

				function generateDistributionTable() {

					var newValue = [];

					var value = $scope.params.first;
					var delta = ($scope.params.first - $scope.params.last) / ($scope.params.participants - 1);
					delta = (delta * 100) / 100;
					for(var r=0; r < $scope.params.participants -1; r++) {

						newValue.push(Math.floor(value));
						value = (value - delta);
					}
					newValue.push($scope.params.last);

					$scope.value = newValue;
				}


				function setParamValues() {
					$scope.params.first = $scope.value[0] || 0;
					$scope.params.last = $scope.value[$scope.value.length - 1] || 0;
					$scope.params.total = getTotalPoints($scope.value);

					if ($scope.chart !== undefined) {
						$scope.chart.options.categoryAxis.categories = generateCategoryAxisArray();
						$scope.chart.options.series = getTableData();
						$scope.chart.refresh();
					}
				}

				function getTableData() {
					var ret = [{
						name: 'reparto',
						data: new kendo.data.ObservableArray([])
					}];

					for(var r=0; r < $scope.value.length; r++) {
						ret[0].data.push({
							index: r+1,
							value: $scope.value[r]
						});
					}

					return ret;
				}

				function generateCategoryAxisArray() {
					var array = [];
					array.push(1);
					for(var r=1; r < $scope.value.length - 1; r++) {
						array.push(undefined);
					}
					array.push($scope.value.length);
					return array;
				}

				function getDistributionById(id) {
					for(var r=0; r < $scope.distributions.length; r++) {
						if ($scope.distributions[r]._id === id) return $scope.distributions[r];
					}
					return undefined;
				}

				function getTotalPoints(table) {
					if (table === undefined) return 0;
					return table.reduce(function(a, b) {
						return a+b;
					}, 0);
				}


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

                    $http.get('app/main/common/fields/distribution-field/distribution-field-' + mode + '.html', {cache: $templateCache}).success(function(html) {
                        generateElement(html);
                    });
				};

            }
        };
    }
})();
