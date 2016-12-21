
	define([

	], function(

	) {

		'use strict';

		return function(Arguments) {

			var Dictionary = {};
			var Args = [].slice.call(Arguments);

			for(var L=1; L<Args.length; L++) {

				var Dic = JSON.parse(Args[L]);

				for(var Key in Dic) {

				   Dictionary[Key] = Dic[Key];
				}
			}

			return Dictionary;
		}
	});