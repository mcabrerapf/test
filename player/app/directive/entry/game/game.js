
	define([
		'main-module',
		'text!./game.html'
	],
	function(
		Module,
		Template
	) {

		'use strict';

		Module.CompileProvider.directive('bgGame', function() {

			var Controller =  [
				'$scope',
			function(
				$scope
			) {

				console.log('GAME');
			}];

			return {
				restrict: 'E',
				replace: true,
				template: Template,
				controller: Controller
			};
		});
	});