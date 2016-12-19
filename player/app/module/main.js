
	define([
		'angular',
		'angular-router',
		'angular-animate',
		'angular-translate',
		'angular-dynamic-locale'
	],
	function(
		A
	) {

		'use strict';

		var Module = angular.module('bgplayer', [
			'ui.router',
    		'ngAnimate',
			'pascalprecht.translate',
			'tmh.dynamicLocale'
		]);

		return Module;
	});
