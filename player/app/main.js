
	define([
		'angular',
		'main-module',
		'app/service/bg-translate-loader',
		'app/service/bg-translate',
		'app/service/bg-api',
		'materialize',
		'app/page/root/root'
	],
	function(
		A,
		Module,
		TransalateLoader,
		Translate,
		APIService,
		Materialize,
		Root
	) {

		'use strict';

		var DefaultLang = 'es';

		function defineRoute(provider, id, url, config, extra) {

			var RouteConfig = angular.extend({}, config, { url: url }, extra);
			provider.state(id, RouteConfig);
		};

		Module.config([
			'$provide',
			'$compileProvider',
			'$stateProvider',
			'$urlRouterProvider',
			'$locationProvider',
			'$translateProvider',
			'tmhDynamicLocaleProvider',
		function(
			$provide,
			$compileProvider,
			$stateProvider,
			$urlRouterProvider,
			$locationProvider,
			$translateProvider,
			tmhDynamicLocaleProvider
		) {

			Module.CompileProvider = $compileProvider;

			$locationProvider.html5Mode(true);

			$translateProvider.useLoader('BGTranslateLoader');
			$translateProvider.preferredLanguage(DefaultLang);
			$translateProvider.useSanitizeValueStrategy('escape');

			tmhDynamicLocaleProvider.localeLocationPattern('/translate/locale/angular-locale_{{locale}}.js');

			$provide.decorator('$state', function($delegate, $rootScope) {

				$rootScope.$on('$stateChangeStart', function($event, State, Params) {

					$delegate.next = State;
					$delegate.toParams = Params;
				});

				return $delegate;
			});

		    var route = defineRoute.bind(null, $stateProvider);
		    $urlRouterProvider.otherwise('/');

		    route('root', 				'/', 			Root);
		    route('login', 				'/login', 		Root);
		    route('blog', 				'/blog', 		Root);
		    route('game', 				'/game', 		Root);
		}]);

		Module.run([
			'tmhDynamicLocale',
			'BGAPIService',
			'$state',
		function(
			tmhDynamicLocale,
			BGAPIService,
			$state
		) {

			tmhDynamicLocale.set(DefaultLang);
			window.state = $state;
		}]);

  		angular.bootstrap(document, [ Module.name ]);
	});
