
(function ()
{
    'use strict';

    /**
     * Kaldeera Forms Module
     */


	angular.module('kaldeera.forms', [	'ng', 
										'kaldeera.forms/templates', 
//										'$strap.directives',
										'ui.ace'
    ]);


	/*
		Uso:
			<kldform name="collectionName" mode="display|edit">
				<p>Contenido del formulario</p>
			</kldform>
	*/
	
	angular.module('kaldeera.forms').directive('kldform', [function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/core/forms/templates/kldform.html',
			transclude: true,
			controller: ['$scope', '$attrs', function($scope, $attrs) {
				this.name = $attrs.name;
				this.getMode = function() {
					var mode = $scope.mode;
					if (mode == undefined) mode = $attrs.mode;
					return mode;
				};
			}],
			scope: false,
			link: function($scope, $element, $attrs) {
			}
		};

	}]);

	/*
		Uso:
			<field 	type="text|note|email|xxxx"
					ng-model="modelo" 
					mode="edit|display" 
					display-format="filtroDeDisplay" 
					required
					label="Texto de la etiqueta"
					ng-minlength="1"
					ng-maxlength="20"
					ng-pattern=""
					autofocus
					/>

	*/
	angular.module('kaldeera.forms').directive('field', ['$compile', function($compile) {
		return {
			restrict: 'E',
			replace: true,
			link: function(scope, element, attrs) {

				// analizamos el tipo y generamos el campo correspondiente
				if (!attrs.type) attrs.type = 'text';

				var originalAttrs = element[0].attributes;
				var elementAttributes = '';
				for (var r=0; r < originalAttrs.length; r++) {
					elementAttributes += originalAttrs.item(r).nodeName +'="' + originalAttrs.item(r).value + '" ';
				}

				var html = '<' + attrs.type + '-field ' + elementAttributes + '>' + element.text() + '</' + attrs.type + '-field>';

				var newElement = $compile(html)(scope);
				element.replaceWith(newElement);
				element = newElement;
			}
		};

	}]);



	/*

		Campo de tipo texto

	*/
	angular.module('kaldeera.forms').directive('textField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {

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

				$scope.$watch('value', function(newValue, oldValue) {
					controllers[0].$setViewValue(newValue);	
				});


				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
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

					switch(mode) {
						case 'edit':
							$http.get('app/core/forms/templates/text-field-edit.html', {cache: $templateCache}).success(function(html) {
								var elementAttributes = ($attrs.required != undefined 	? 'required '  : '') +
														($attrs.id != undefined ? 'id="' + $attrs.id + '" ': '') +
														($attrs.autofocus != undefined 	? 'autofocus ' : '') +
														($attrs.mdAutofocus != undefined ? 'md-autofocus ' : '') +
														($attrs.ngMinlength != undefined ? 'ng-minlength="' + $attrs.ngMinlength + '" ' : '') +
														($attrs.ngMaxlength != undefined ? 'ng-maxlength="' + $attrs.ngMaxlength + '" ' : '') +
														($attrs.ngFocus != undefined ? 'ng-focus="' + $attrs.ngFocus + '" ' : '') +
														($attrs.ngBlur != undefined ? 'ng-blur="' + $attrs.ngBlur + '" ' : '') +
														($attrs.ngModelOptions != undefined ? 'ng-model-options="' + $attrs.ngModelOptions + '" ' : '') +
														($attrs.ngPattern != undefined ? 'ng-pattern="' + $attrs.ngPattern + '" ' : '') +
														($attrs.placeholder != undefined ? 'placeholder="' + $attrs.placeholder + '" ' : '');

								html = html.replace('<input ', '<input ' + elementAttributes);

								generateElement(html);
							});

							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/text-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('ng-bind="value"', 'ng-bind-html="value | ' + $attrs.displayFormat + '"');
								}
								generateElement(html);
							});
							break;
					};

				};
			}
		};

	}]);


	/*

		Campo de tipo number

	*/
	angular.module('kaldeera.forms').directive('numberField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {

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

				$scope.$watch('value', function(newValue, oldValue) {
					controllers[0].$setViewValue(newValue);	
				});

				$scope.getMode = function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				};
				
				$scope.$watch(function() { return $scope.getMode() }, function(newMode) {
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

					switch(mode) {
						case 'edit':
							$http.get('app/core/forms/templates/number-field-edit.html', {cache: $templateCache}).success(function(html) {
								var elementAttributes = ($attrs.required != undefined 	? 'required '  : '') +
														($attrs.autofocus != undefined 	? 'autofocus ' : '') +
														($attrs.mdAutofocus != undefined ? 'md-autofocus ' : '') +
														($attrs.ngModelOptions != undefined ? 'ng-model-options="' + $attrs.ngModelOptions + '" ' : '') +
														($attrs.ngPattern != undefined ? 'ng-pattern="' + $attrs.ngPattern + '" ' : '') +
														($attrs.ngMinlength != undefined ? 'ng-minlength="' + $attrs.ngMinlength + '" ' : '') +
														($attrs.ngMaxlength != undefined ? 'ng-maxlength="' + $attrs.ngMaxlength + '" ' : '') +
														($attrs.placeholder != undefined ? 'placeholder="' + $attrs.placeholder + '" ' : '');

								html = html.replace('<input ', '<input ' + elementAttributes);

								generateElement(html);
							});
							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/number-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('{{value}}', '{{value | ' + $attrs.displayFormat + '}}');
								}
								generateElement(html);
							});
							break;
					};

				};
			}
		};

	}]);

	/*

		Campo de tipo email

	*/

	angular.module('kaldeera.forms').directive('emailField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {

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

				$scope.$watch('value', function(newValue, oldValue) {
					controllers[0].$setViewValue(newValue);	
				});

				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
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

					switch(mode) {
						case 'edit':
							$http.get('app/core/forms/templates/email-field-edit.html', {cache: $templateCache}).success(function(html) {
								var elementAttributes = ($attrs.required != undefined 	? 'required '  : '') +
														($attrs.autofocus != undefined 	? 'autofocus ' : '') +
														($attrs.mdAutofocus != undefined ? 'md-autofocus ' : '') +
														($attrs.ngMinlength != undefined ? 'ng-minlength="' + $attrs.ngMinlength + '" ' : '') +
														($attrs.ngMaxlength != undefined ? 'ng-maxlength="' + $attrs.ngMaxlength + '" ' : '') +
														($attrs.ngPattern != undefined ? 'ng-pattern="' + $attrs.ngPattern + '" ' : '') +
														($attrs.placeholder != undefined ? 'placeholder="' + $attrs.placeholder + '" ' : '');

								html = html.replace('<input ', '<input ' + elementAttributes);

								generateElement(html);
							});
							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/email-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('{{value}}', '{{value | ' + $attrs.displayFormat + '}}');
								}
								generateElement(html);
							});
							break;
					};

				};
			}
		};

	}]);


	/*

		Campo de tipo Note (textarea)

	*/
	angular.module('kaldeera.forms').directive('noteField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {

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

				if ($attrs.rows) $scope.rows = $attrs.rows;

				$scope.$watch('value', function(newValue, oldValue) {
					controllers[0].$setViewValue(newValue);	
				});

				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
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

					switch(mode) {
						case 'display':
							$http.get('app/core/forms/templates/note-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('{{value}}', '{{value | ' + $attrs.displayFormat + '}}');
								}
								if ($attrs.code) {
									html = html.replace('<div ng-bind="value"></div>', '<pre ng-bind="value"></pre>');
								}
								generateElement(html);
							});
							break;

						case 'edit':
							$http.get('app/core/forms/templates/note-field-edit.html', {cache: $templateCache}).success(function(html) {
								var elementAttributes = ($attrs.required != undefined 	? 'required '  : '') +
														($attrs.autofocus != undefined 	? 'autofocus ' : '') + 
														($attrs.mdAutofocus != undefined ? 'md-autofocus ' : '') +
														($attrs.maxlength != undefined ? 'md-maxlength="' + $attrs.maxlength + '" ' : '') +
														($attrs.placeholder != undefined ? 'placeholder="' + $attrs.placeholder + '" ' : '');
								html = html.replace('<textarea ', '<textarea ' + elementAttributes);

								if ($attrs.code) {
									html = html.replace('<textarea', '<div ui-ace="aceOptions" style="min-height:150px" ');
									html = html.replace('</textarea>', '</div>');
									$scope.aceOptions = {
										mode: $attrs.code.toLowerCase(),
										onLoad: function (_ace) {
											// HACK to have the ace instance in the scope...
											$scope.modeChanged = function () {
												_ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
											};
										}
									}
								}

								generateElement(html);
							});

							break;
					};

				};

			}
		};

	}]);

	/*

		Campo de tipo Date

	*/
	angular.module('kaldeera.forms').directive('dateField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: '@',
				label: '@',
				mdMinDate: '=',
				mdMaxDate: '=',
				value: '=ngModel'
			},
			link: function($scope, $element, $attrs, controllers) {

				$scope.$watch('value', function(newValue, oldValuie) {
					/* Se transforma a Date, ya que vuelve como string desde BBDD */
					if (typeof newValue == 'string' && newValue.trim() != '') {
						newValue = new Date(newValue);
					}

					controllers[0].$setViewValue(newValue);
				});
				
				$scope.$watch(function() {
					var selectMode = 'display';
					
					if ($scope.mode != undefined) {
						selectMode = $scope.mode;
					} else {
						if (controllers[1]) selectMode = (controllers[1].getMode());
					}
					
					return selectMode;
				}, function(newMode) {
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
					switch (mode) {
						case 'edit':
							$http.get('app/core/forms/templates/date-field-edit.html', { cache: $templateCache }).success(function (html) {
								var elementAttributes = ($attrs.required != undefined ? 'required' : '') + ' ' +
														($attrs.ngRequired != undefined ? 'ng-required' : '') + ' ' +
														($attrs.ngDisabled != undefined ? 'ng-disabled="' + $attrs.ngDisabled + '"' : '') + ' ';

								html = html.replace('<md-datepicker ', '<md-datepicker ' + elementAttributes);
								
								generateElement(html);
							});
							
							break;
							
						case 'display':
						default:
							$http.get('app/core/forms/templates/date-field-display.html', { cache: $templateCache }).success(function (html) {
								if ($attrs.displayFormat) {
									html = html.replace('| date:\'\shortDate\'', '| ' + $attrs.displayFormat);
								}
								generateElement(html);
							});
							
							break;
					};
				};
			}
		};
	}]);

	/*

		Campo de tipo Boolean 

	*/
	angular.module('kaldeera.forms').directive('booleanField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {

		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: '@',
				label: '@',
				ngTrueValue: '@',
				ngFalseValue: '@',
				value: '=ngModel'
			},
			link: function($scope, $element, $attrs, controllers) {

				if ($scope.ngTrueValue === undefined) $scope.ngTrueValue = true;
				if ($scope.ngFalseValue === undefined) $scope.ngFalseValue = false;

				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function(newMode) {
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

					switch(mode) {
						case 'display':
							$http.get('app/core/forms/templates/boolean-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('{{value}}', '{{value | ' + $attrs.displayFormat + '}}');
								}
								generateElement(html);
							});
							break;

						case 'edit':
							$http.get('app/core/forms/templates/boolean-field-edit.html', {cache: $templateCache}).success(function(html) {
								var elementAttributes = ($attrs.class != undefined ? 'class="' + $attrs.class + '"' : '') + ' ';

								html = html.replace('<md-switch ', '<md-switch ' + elementAttributes);
								
								generateElement(html);
							});
							break;
					};

				};

			}
		};

	}]);

	/*

		Campo de tipo Select

	*/
	angular.module('kaldeera.forms').directive('selectField', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: 			'@',
				value: 			'=ngModel',
				label: 			'@',
				items: 			'=',
				valueField: 	'@',
				displayField: 	'@',
				detailTemplate: '@'
			},
			link: function($scope, $element, $attrs, controllers) {

				// Busca un objeto en un array. Retorna el índice, o -1 si no está
				function getIndex (obj, arrObj) {
					for (var r = 0; r < arrObj.length; r++)	{
						if ($scope.valueField) {
							if (arrObj[r][$scope.valueField] == obj) return r;
						} else {
							if (angular.toJson(arrObj[r]) == angular.toJson(obj)) return r;
						}
					}

					return -1;
				};

				// "Normaliza" el valor retornado por la SELECT (value)
				// para que sea del mismo tipo que su OPTION correspondiente
				// y pueda visualizarse como valor preseleccionado, cuando éste exista
				// http://odetocode.com/blogs/scott/archive/2013/06/19/using-ngoptions-in-angularjs.aspx

				$scope.$watch('value', function (newValue) {
					if (typeof newValue === 'object') {
						// buscamos el nuevo valor dentro del array de opciones
						var index = getIndex(newValue, $scope.items);
						if (index >= 0) $scope.value = $scope.items[index];
					}
				});

				//--------------------------------------------------

				function getMode() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return controllers[1].getMode();
					return 'display';
				}

				$scope.$watch(
					function() { return getMode(); },
					function(newMode) {	show(newMode); }
				);

				function isUpperCase(c) {
					return ( c === c.toUpperCase() );
				};

				function ng2html(ngStr) {
					var html = '';
					for (var i = 0; i < ngStr.length; i++) {
						var c = ngStr.charAt(i);
						html += ( isUpperCase(c) ? '-' + c.toLowerCase() : c );
					};

					return html;
				};

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
					switch(mode) {
						case 'edit':
							$http.get('app/core/forms/templates/select-field-edit.html', {cache: $templateCache}).success(function(html) {
								// Inserta atributos en el template
								var elementAttributes = ($attrs.required != undefined 	? 'required '  : '') +
														($attrs.id != undefined ? 'id="' + $attrs.id + '" ': '') +
														($attrs.autofocus != undefined 	? 'autofocus ' : '') +
														($attrs.multiple != undefined 	? 'multiple ' : '') +
														($attrs.mdNoAsterisk != undefined ? 'md-no-asterisk ' : '') +
														($attrs.mdAutofocus != undefined ? 'md-autofocus ' : '') +
														($attrs.placeholder != undefined ? 'placeholder="' + $attrs.placeholder + '" ' : '');

								html = html.replace('<md-select ', '<md-select ' + elementAttributes);

								generateElement(html);
							});
							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/select-field-display.html', {cache: $templateCache}).success(function(html) {
								if ($attrs.displayFormat) {
									html = html.replace('ng-bind="value"', 'ng-bind-html="value | ' + $attrs.displayFormat + '"');
								}

								generateElement(html);
							});
							break;
					}
				};


				$scope.getDisplayValue = function() {
					if ($scope.valueField !== undefined) {
						var idx = getIndex($scope.value, $scope.items);
						return $scope.items[idx][$scope.displayField]
					} else {
						return $scope.value;
					}
				}

			}
		};
	}]);
	

	/*

		Campo de tipo Password

	*/
	angular.module('kaldeera.forms').directive('passwordField', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^kldform'],
			replace: true,
			scope: {
				mode: '@',
				value: '=ngModel'
			},
			link: function($scope, $element, $attrs, controllers) {

				// Funciones para validación específica
				// (no incluida de serie en el INPUT)

				$scope.pass = { regexp: /^$/, word2: $scope.value };

				function chkEqPassword() {
					return ($scope.value === $scope.pass.word2);
				};


				$scope.$watch(
					function () { return $scope.value + $scope.pass.word2; },
					function () {
						$scope.pass.regexp = new RegExp("^" + $scope.value + "$");

						controllers[0].$setValidity('chkEqPassword', chkEqPassword());
				});

				function getMode() {
					if ($scope.mode != undefined) return $scope.mode;
					return (controllers[1].getMode());
				}

				$scope.$watch(
					function() { return getMode(); },
					function(newMode) {	show(newMode); }
				);

				function generateElement(html) {
					var newElement = $compile(html)($scope);
					$element.replaceWith(newElement);
					$element = newElement;

					$scope.modelCtrl = controllers[0];
				};

				function ng2html(ngStr) {

					function isUpperCase(c) {
						return ( c === c.toUpperCase() );
					};

					var html = '';
					for (var i = 0; i < ngStr.length; i++) {
						var c = ngStr.charAt(i);
						html += ( isUpperCase(c) ? '-' + c.toLowerCase() : c );
					};

					return html;
				};

				function show(mode) {
					switch(mode) { 
						case 'edit':
							$http.get('app/core/forms/templates/password-field-edit.html', {cache: $templateCache}).success(function (html) {

								var elementAttributes = '';

								['autofocus', 'required'].forEach(function (attr) {
									elementAttributes += ($attrs[attr] ? attr + ' ' : '');
								});

								['ngPattern', 'ngMinlength', 'ngMaxlength'].forEach(function (attr) {
									elementAttributes += ($attrs[attr] ? ng2html(attr) + '="' + $attrs[attr] + '" ' : '');
								});

								html = html.replace('data-attrs', elementAttributes);

								generateElement(html);
							});
							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/password-field-display.html', {cache: $templateCache}).success(function (html) {
								generateElement(html);
							});
							break;
					};
				};

			}
		};
	}]);


	/*

		Campo de tipo Color

	*/
	angular.module('kaldeera.forms').directive('colorField', ['$compile', '$templateCache', '$http', function($compile, $templateCache, $http) {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/field-control.html',
			require: ['ngModel', '^?kldform'],
			replace: true,
			scope: {
				mode: '@',
				value: '=ngModel'
			},
			link: function ($scope, $element, $attrs, controllers) {
				function checkColorFormat(newValue) {
					return (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).test(newValue);
				};

				$scope.$watch('value', function (newValue, oldValue) {
					controllers[0].$setValidity('checkColorFormat', checkColorFormat(newValue));

					controllers[0].$setViewValue(newValue);	
				});

				$scope.$watch(function() {
					if ($scope.mode != undefined) return $scope.mode;
					if (controllers[1]) return (controllers[1].getMode());
					return 'display';
				}, function (newMode) {
					show(newMode);
				});

				function generateElement (html) {
					var newElement = $compile(html)($scope);
					$element.replaceWith(newElement);
					$element = newElement;

					$scope.modelCtrl = controllers[0];
				};

				function show (mode) {
					switch(mode) {
						case 'edit':
							$http.get('app/core/forms/templates/color-field-edit.html', { cache: $templateCache }).success(function (html) {
								var elementAttributes = ($attrs.required != undefined ? 'required ' : '');
								html = html.replace('<input ', '<input ' + elementAttributes);

								generateElement(html);
							});

							break;

						case 'display':
						default:
							$http.get('app/core/forms/templates/color-field-display.html', { cache: $templateCache }).success(function (html) {
								generateElement(html);
							});

							break;
					};
				};
			}
		};
	}]);



	/*

		Visualización de los mensajes de error!

	*/
	angular.module('kaldeera.forms').directive('fieldValidationMessages', [function() {

		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/core/forms/templates/field-validation-messages.html'
		};
	}]);

// ---------------------------------------------------------------------------------------------------------------
// Form buttons --
//
//	De momento esta directiva no está clara .... probablemente sea mejor traspasar los atributos allow-* al formulario
//	y disponer de alguna sub-directiva que auto-visualize (oF elimine) elementos en función del estado del formulario
//	De este modo podemos controlar más cosas (paneles, campos, ...) y no solo los botones
//	Ej: 
//			<button-new on-display allow-insert />
//			<button-edit on-display allow-edit />
//			<button-remove on-display allow-remove allow-edit />
//			<button-save on-new />
//			<button-update on-edit />
//			<button-cancel on-edit on-new />

	angular.module('kaldeera.forms').directive('formButtons', ['$templateCache', '$http', '$compile', function($templateCache, $http, $compile) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'app/core/forms/templates/form-buttons.html',
			require: '^kldform',
			scope: {
				mode: '@',
				isNew: '@',
				allowRemove: '@',
				allowCreate: '@',
				allowEdit: '@'
			},
			link: function($scope, $element, $attrs, formController) {

				function getMode() {
					if ($scope.mode != undefined) return $scope.mode;
					if (formController != undefined) return formController.getMode();
					return 'display';
				}

				function addButton(buttonName) {
					var html = '<button-' + buttonName + ' /> ';
					$element.append($compile(html)($scope));
				}

				$scope.$watch(function() {

					return  (getMode() || '') + 
							($scope.isNew ? 'true' : 'false') +
							($scope.allowRemove ? 'true' : 'false') +
							($scope.allowInsert ? 'true' : 'false') +
							($scope.allowEdit ? 'true' : 'false');
				
				}, function(newStatus) {

					console.log('new status ....' + newStatus);
					console.log('mode: ' + getMode());

					$element.empty();
					if (getMode() == 'edit') {
						if ($scope.isNew) {
							addButton('create');
						} else {
							addButton('save');
						}
						addButton('cancel');
					} else {
						if ($scope.allowEdit) addButton('edit');
						if ($scope.allowRemove) addButton('remove');
						if ($scope.allowCreate) addButton('new');
					}
				});

				$scope.edit = function() { if ($scope.$parent.edit) $scope.$parent.edit(); }
				$scope.remove = function() { if ($scope.$parent.remove) $scope.$parent.remove(); }
				$scope.new = function() { if ($scope.$parent.new) $scope.$parent.new(); }
				$scope.save = function() { if ($scope.$parent.save) $scope.$parent.save(); }
				$scope.update = function() { if ($scope.$parent.update) $scope.$parent.update(); }
				$scope.cancel = function() { if ($scope.$parent.cancel) $scope.$parent.cancel(); }
			}
		};
	}]);



	angular.module('kaldeera.forms').directive('buttonNew', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-new.html',
			replace: true,
			scope: false
		};
	}]);

	angular.module('kaldeera.forms').directive('buttonEdit', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-edit.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonUpdate', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-update.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonSave', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-save.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonCancel', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-cancel.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonRemove', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-remove.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonRefresh', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-refresh.html',
			replace: true,
			scope: false
		};
	}]);
	angular.module('kaldeera.forms').directive('buttonSend', [function() {
		return {
			restrict: 'E',
			templateUrl: 'app/core/forms/templates/button-send.html',
			replace: true,
			scope: false
		};
	}]);


    // ---------------------------------------------------------------------------------------------------------------
    // Templates --
    //
    angular.module("kaldeera.forms/templates", []).run(["$templateCache", function($templateCache) {
        $templateCache.put('app/core/forms/templates/button-new.html', 	'<button class="btn btn-blue"><i class="icon-plus-sign"></i>{{\'form.new\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-edit.html', 	'<button class="btn btn-blue"><i class="icon-pencil"></i> {{\'form.edit\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-update.html', '<button class="btn btn-blue"><i class="icon-save"></i> {{\'form.update\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-save.html', 	'<button class="btn btn-blue"><i class="icon-save"></i> {{\'form.save\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-cancel.html', '<button class="btn btn-default"><i class="icon-remove"></i> {{\'form.cancel\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-remove.html', '<button class="btn btn-red"><i class="icon-trash"></i> {{\'form.remove\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-refresh.html','<button class="btn btn-default"><i class="icon-refresh"></i> {{\'form.refresh\'}}</button>');
        $templateCache.put('app/core/forms/templates/button-send.html','<button class="btn btn-green"><i class="icon-ok"></i> {{\'form.send\'}}</button>');
    }]);


})();
