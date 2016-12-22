
	define([

		// loader

		'./loader',

		// Dictionaries

		'text!./ca/common.json',
		'text!./ca/test.json'

	], function(
		loader
	) {

		'use strict';

		return loader(arguments);
	});