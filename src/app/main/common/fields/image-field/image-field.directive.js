(function ()
{
    'use strict';

    angular
        .module('app.common')
        .directive('imageField', imageFieldDirective);

    /** @ngInject */
    function imageFieldDirective($compile, $http, $templateCache, api)
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


				const type2icon = {
					'unknown': 	'file',
					'folder': 	'folder-outline',
					'image': 	'file-image',
					'html': 	'file-xml',
					'pdf': 		'file-pdf',
					'doc': 		'file-document'
				};

				function getTreeViewData(folderData) {

					return folderData.map(function(entry){

						var node = {
							id: 		entry.path,
							text: 		entry.name,
							type: 		entry.type,
							iconUrl: 	'/assets/icons/treeview/' + type2icon[entry.type] + '.svg',
							mtime: 		entry.mtime
						};

						if (entry.type == 'folder') {
							node.expanded   = true;
							node.items      = getTreeViewData(entry.contents);
						} else {
							node.size		= entry.size;
						};

						return node;
					});
				}

                $scope.changeImage = function() {

					api.themes.folder.list({id: $scope.id}, function(folderData) {

						$scope.folderTree = folderData;
						$scope.treeView = {

							options: {
								dataImageUrlField: "iconUrl",
								dragAndDrop: false,
								select: function(event) {
									$scope.$apply(function() {
										$scope.selectedItem = $scope.tree.dataItem( event.node );
										console.log('selected:', event.node);
									});
								},
								navigate: function(event) {
									console.log('navigate:', event.node);
								}
							},
							dataSource: new kendo.data.ObservableArray(getTreeViewData(folderData))
						};

						$scope.onSelectImage = true;
					});

                }
            }
        };
    }
})();
