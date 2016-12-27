

	requirejs([
		'../bower_components/text/text.js!./config/app.json'
	], function(Config) {

		'use strict';

		var APPConfig = JSON.parse(Config);

		return requirejs.config(APPConfig)([ './app/main' ]);
	});