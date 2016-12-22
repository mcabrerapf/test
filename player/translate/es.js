
	define([

		// loader

		'./loader',

		// Dictionaries

		'text!./es/common.json',
		'text!./es/test.json'

	], function(
		loader
	) {

		'use strict';

		return loader(arguments);
	});