
	define([

	],
	function(

	) {

		'use strict';

		var Controller = [
			'$scope',
			'$compile',
			'$element',
			'Entry',
		function(
			$scope,
			$compile,
			$element,
			Entry
		) {

			if(Entry) {

				requirejs([ Entry.File ],
				function() {

					var $LoginContent = $compile(Entry.Template)($scope);
		            $element.html($LoginContent);
				});
			}
		}];

		return {
			controller: Controller,
			resolve: {
				Entry: function($state, $timeout) {

					var Entry = {
						login: {
							File: 'app/directive/entry/login/login',
							Template: '<bg-login></bg-login>'
						},
						game: {
							File: 'app/directive/entry/game/game',
							Template: '<bg-game></bg-game>'
						},
						blog: {
							File: 'app/directive/entry/blog/blog',
							Template: '<bg-blog></bg-blog>'
						}
					};

					return Entry[$state.next.name];
				}
			}
		};
	});