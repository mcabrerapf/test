
	define([
		'text!./test.html'
	],
	function(
		Template
	) {

		'use strict';

		var Controller = [
			'$rootScope',
			'$scope',
			'BGTranslate',
		function(
			$rootScope,
			$scope,
			BGTranslate
		) {

			// ---------------------------------------------------------------------
			// TRANSLATE

			$scope.T = BGTranslate;
			$scope.T.addKeys([
				'COMMON.TITLE'
			]);
		}];

		return {
			template: Template,
			controller: Controller
		};
	});