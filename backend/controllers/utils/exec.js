// --------------------------------------------------------------------------------------
// Ejecuta programa externo.
// Retornan Q.promise


'use strict';


var Exec 	= require('child_process').exec;
var Q 		= require('q');

var NICE 	= '/usr/bin/nice -n ';

exports.execCommand = function (command, outError, nice, cwd) {
	if (nice) command = NICE + nice + ' ' + command;
	
	var fname = 'exec ' + command;
	var defer = Q.defer();
	Exec(command, {encoding: 'binary', cwd: cwd},
		function (error, stdout, stderr) {
			defer.notify(fname);
			
			if (error)	defer.reject({f:fname, e:stderr});
			else 		defer.resolve( outError ? stderr : stdout );
		}
	);
	return defer.promise;
};