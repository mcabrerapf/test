
	define([
		'lodash',
		'main-module'
	],
	function(
		_,
		Module
	) {

		'use strict'

		Module.factory('BGTranslate', [
			'$rootScope',
			'$q',
			'$translate',
			'tmhDynamicLocale',
		function(
			$rootScope,
			$q,
			$translate,
			tmhDynamicLocale
		) {

			var self = {

				Lang: '',

				Dict: {},

				changeLang: function(Lang) {

					self.Lang = Lang;
			    	$translate.use(Lang);
			    	tmhDynamicLocale.set(Lang);
			    },

			    translate: function(Key, Vars) {

					var q = $q.defer();
					$translate(Key, Vars).then(q.resolve, q.resolve);
					return q.promise;
			    },

			    addKeys: function(Keys) {

			    	_.forEach(Keys, function(Key) {

			    		self.Dict[Key] = '';
			    	});

			    	translateDict();
			    }
			};

			/* refresh translation */

			function translateDict() {

				var Keys = _.keys(self.Dict);

				self
				.translate(Keys)
				.then(function(T) {

					self.Dict = T;
				});
			}

			$rootScope.$on('$translateChangeSuccess', translateDict);

			/* Tool to check translation */

    		window.BGchangeLang = self.changeLang;
    		window.BGtranslate = self.translate;

			return self;
		}]);
	});