// --------------------------------------------------------------------------------------
// Gestión del FileSystem.
// Retornan Q.promise


'use strict';


module.exports = {
	createItemFolder: 	createItemFolder,
	removeItemFolder:   removeItemFolder,

	blank2hyphen: 		blank2hyphen,
	normalize: 			normalize,
	renameFile: 		renameFile,
	removeFile: 		removeFile,
	removeFileGlob:		removeFileGlob,
	createDir: 			createDir,		// mkdir(), mkdir -p 	# genera directorios padres si no existen
	cleanDir: 			cleanDir,		// rm -rf dir/*			# sólo contenido del directorio, recursivamente
	removeDir: 			removeDir		// rm -rf dir 			# directorio y su contenido su directorio, recursivamente
};


var Fs 					= require('fs');
var Q 					= require('q');
var Exec 				= require('./exec.js');
var ParseReqRes			= require('./parsereqres.js');

var E_ENOENT 	= 34;	// errno, cuando entrada no existe (man 2)

// --------------------------------------------------------------------------------------
// createItemFolder: crea el directorio para almacenar el item de la collection.

function createItemFolder (req, res, next) {

	var folder = ParseReqRes.getItemFolder(req, res);

	console.log('filesystem.js:::: \n DEBUG (INFO): createItemFolder:', folder);

	createDir(folder).done(

		function (result) {
			return next();
		},
		function (error) {
			console.log('DEBUG (ERR): createItemFolder:', error);
			return res.send(500, error);
		}
	);
};


// --------------------------------------------------------------------------------------
// removeItemFolder: borra el directorio donde se almacena el item de la collection.
// Recursivamente, borra archivos y directorios contenidos.

function removeItemFolder (req, res, next) {
	var folder = ParseReqRes.getItemFolder(req, res);

	console.log('DEBUG (INFO): removeItemFolder:', folder);

	removeDir(folder).done(
		
		function (result) {
			return next();
		},
		function (error) {
			console.log('DEBUG (WARN): removeItemFolder:', error);
			//return res.send(500, error);
			return next();
		}
	);
};






function renameFile(oldFullPath, newFullPath) {
	var fname = 'renameFile';
	var defer = Q.defer();
	Fs.rename( oldFullPath, newFullPath,
		function (error, result) {
			defer.notify(fname + ': ' + oldFullPath + ' -> ' + newFullPath);
			
			if (error)	defer.reject({f:fname, e:error});
			else		defer.resolve(result);
		}
	);
	return defer.promise;
};

function removeFile(fullPath) {
	var fname = 'removeFile';
	var defer = Q.defer();
	Fs.unlink( fullPath,
		function (error, result) {
			defer.notify(fname + ': ' + fullPath);

			if (error && error.errno !== E_ENOENT) 	defer.reject({f:fname, e:error});
			else									defer.resolve(result);
		}
	);
	return defer.promise;
};


/*
function createDir(dirName) {
	var fname = 'createDir';	
	var defer = Q.defer();
	Fs.mkdir( dirName,
		function (error, result) {
			if (error)	defer.reject({f:fname, e:error});
			else		defer.resolve(result);
		}
	);
	return defer.promise;
};
*/


function createDir(dirName) {
	return Exec.execCommand('/bin/mkdir -p ' + dirName);
};


function cleanDir(dirName) {
	return Exec.execCommand('/bin/rm -rf ' + dirName + '/*');
};


function removeDir(dirName) {
	return Exec.execCommand('/bin/rm -rf ' + dirName);
};

function removeFileGlob(fullPathGlob) {
	return Exec.execCommand('/bin/rm -f ' + fullPathGlob);
};


var UNDERSCORE = '_';
var HYPHEN = '-';

function blank2hyphen(str) {
	return str.trim().replace(/\s+/g, UNDERSCORE);
};

function normalize(str) {
	return str.trim().replace(/\s+/g, UNDERSCORE).replace(/[\/\\]+/g, HYPHEN);
};