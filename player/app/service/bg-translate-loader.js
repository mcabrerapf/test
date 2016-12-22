
	define([
		'main-module'
	],
	function(
		Module
	) {

		'use strict'

		Module.factory('BGTranslateLoader', [
			'$http',
			'$q',
		function(
			$http,
			$q
		) {

			return function (options) {

				var Dictionary = {};
				var Lang = options.key;
				var DictionaryPath = 'translate/' + Lang;

				var deferred = $q.defer();

				require([ DictionaryPath ], function(Dictionary) {

					deferred.resolve(Dictionary);
				});

				return deferred.promise;
			};
		}]);
	});
