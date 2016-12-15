
	define([
		'text!./home.html'
	],
	function(
		Template
	) {

		'use strict';

		var Controller = [
			'$scope',
			'BGTranslate',
		function(
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