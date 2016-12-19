
	define([
		'angular',
		'angular-router',
		'angular-animate',
    	'anim-in-out',
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
    		'anim-in-out',
			'pascalprecht.translate',
			'tmh.dynamicLocale'
		]);

		return Module;
	});
