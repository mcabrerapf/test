
	define([
		'lodash',
		'main-module'
	],
	function(
		_,
		Module
	) {

		'use strict';

		Module.factory(
			'BGAPIService',
			[
				'$http',
				'$q',
			function(
				$http,
				$q
			) {

				var Headers = {
					'Authorization': ''
				};
				var APIUrlBase = '/fakeapi'

				function action(Type, Url, Params) {

					var Q = $q.defer();
					var Url = APIUrlBase + Url;

					$http[Type](Url, Params, { headers: Headers })
					.success(function(Data, Status){

						return Q.resolve({ Data: Data, Status: Status });

					}).error(function(Error) {

						console.log('--------------------------------------------------------');
						console.log('BGAPIService ERROR');
						console.log(Error);
						return Q.reject();
					});

					return Q.promise;
				}

				return {

					get: 		function(Url, Params){ return action('get', 	Url, Params); },
					post: 		function(Url, Params){ return action('post', 	Url, Params); },
					put: 		function(Url, Params){ return action('put', 	Url, Params); },
					delete: 	function(Url, Params){ return action('delete', 	Url, Params); }
				};
			}
		]);
	});