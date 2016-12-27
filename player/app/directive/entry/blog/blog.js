
	define([
		'main-module',
		'text!./blog.html'
	],
	function(
		Module,
		Template
	) {

		'use strict';

		Module.CompileProvider.directive('bgBlog', function() {

			var Controller =  [
				'$scope',
			function(
				$scope
			) {

				console.log('BLOG');
			}];

			return {
				restrict: 'E',
				replace: true,
				template: Template,
				controller: Controller
			};
		});
	});