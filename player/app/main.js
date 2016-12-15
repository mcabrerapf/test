
	define([
		'angular',
		'main-module',
		'app/service/bg-translate-loader',
		'app/service/bg-translate',
		'app/page/home/home',
		'app/page/test/test'
	],
	function(
		angular,
		Module,
		TransalateLoader,
		Translate,
		Home,
		Test
	) {

		'use strict';

		var DefaultLang = 'es';

		function defineRoute(provider, id, url, config, extra) {

			provider.state(id, angular.extend({}, config, { url: url }, extra));
		};

		Module.config([
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider',
			'$translateProvider',
			'tmhDynamicLocaleProvider',
		function(
			$stateProvider,
			$urlRouterProvider,
			$locationProvider,
			$translateProvider,
			tmhDynamicLocaleProvider
		) {

			$locationProvider.html5Mode(true);

			$translateProvider.useLoader('BGTranslateLoader');
			$translateProvider.preferredLanguage(DefaultLang);
			$translateProvider.useSanitizeValueStrategy('escape');

			tmhDynamicLocaleProvider.localeLocationPattern('/translate/locale/angular-locale_{{locale}}.js');

		    var route = defineRoute.bind(null, $stateProvider);
		    $urlRouterProvider.otherwise('/');

		    route('home', '/', Home);
		    route('test', '/test', Test);
		}]);

		Module.run([
			'tmhDynamicLocale',
		function(
			tmhDynamicLocale
		) {

			// Locales
			tmhDynamicLocale.set(DefaultLang);
		}]);

  		angular.bootstrap(document, [ Module.name ]);
	});
