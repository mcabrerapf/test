
	define([
		'main-module',
		'text!./login.html',
		'text!./dialog.html'
	],
	function(
		Module,
		Template,
		DialogTemplate
	) {

		'use strict';

		Module.CompileProvider.directive('bgLogin', function() {

			var Controller =  [
				'$scope',
			function(
				$scope
			) {

				// USER

				$scope.User = {
					Email: '',
					PWD: ''
				}

			}];

			return {
				restrict: 'E',
				replace: true,
				template: Template,
				controller: Controller
			};
		});
	});