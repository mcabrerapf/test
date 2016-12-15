
	define([
		'angular',
		'angular-router',
		'angular-translate',
		'angular-dynamic-locale'
	],
	function(
		angular,
		Router,
		Translate,
		DynamicLocale
	) {

		'use strict';

		var Module = angular.module('bgplayer', [
			'ui.router',
			'pascalprecht.translate',
			'tmh.dynamicLocale'
		]);

		return Module;
	});
