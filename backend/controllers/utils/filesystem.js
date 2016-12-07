// --------------------------------------------------------------------------------------
// Gestión del FileSystem.
// Retornan Q.promise


'use strict';


module.exports = {
	getStructureFolder: getStructureFolder,

	createItemFolder: 	createItemFolder,
	removeItemFolder:   removeItemFolder,

	createSubFolder: 	createSubFolder,
	removeSubFolder: 	removeSubFolder,

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
var Path 				= require('path');
var Q 					= require('q');
var Exec 				= require('./exec.js');
var ParseReqRes			= require('./parsereqres.js');

var E_ENOENT 	= 34;	// errno, cuando entrada no existe (man 2)


// --------------------------------------------------------------------------------------

function getStructureFolder (req, res, next) {

	var fullPath = ParseReqRes.getSubFolder(req, res);

	console.log('DEBUG (INFO): getStructureFolder: [%s]', fullPath);

	if (fullPath === null) return res.status(500).send({msg: "invalid folder name"});

	return res.status(200).send( dumpDirectory( fullPath ) );
};


// --------------------------------------------------------------------------------------

function dumpDirectory (fullPath) {
	console.log('DEBUG (INFO): dumpDirectory: [%s]', fullPath);

	var dump = [];

	if (Fs.existsSync( fullPath )) {
		const entries = Fs.readdirSync( fullPath );

		entries.forEach(function(entry){
			if (entry == '.' || entry == '..') return;

			const 	entryFullPath	= Path.join( fullPath, entry )
			,		stats 			= Fs.statSync( entryFullPath )

			var		fileProperties	= {
										name: 		entry,
										mtime: 		stats.mtime,
										fullPath: 	entryFullPath
									  }

			if (stats.isDirectory()) {
				fileProperties.type = 'directory';
				fileProperties.contents = dumpDirectory( entryFullPath );	// Explora recursivamente
			} else {
				fileProperties.type = 'file';
				fileProperties.size = stats.size;
			};

			dump.push( fileProperties );
		});
	};

	return dump;
};


// --------------------------------------------------------------------------------------

function createSubFolder (req, res, next) {

	var fullPath = ParseReqRes.getSubFolder(req, res);

	console.log('DEBUG (INFO): createSubFolder: [%s]', fullPath);

	if (fullPath === null) return res.status(500).send({msg: "invalid folder name"});

	createDir( fullPath ).done(

		function (result) {
			//return next();
			return res.status(201).send(result);
		},
		function (error) {
			console.log('DEBUG (ERR): createSubFolder:', error);
			return res.status(500).send(error);
		}
	);
};


// --------------------------------------------------------------------------------------

function removeSubFolder (req, res, next) {

	var fullPath = ParseReqRes.getSubFolder(req, res);

	console.log('DEBUG (INFO): removeSubFolder: [%s]', fullPath);

	if (fullPath === null) return res.status(500).send({msg: "invalid folder name"});

	removeDir( fullPath ).done(
		
		function (result) {
			//return next();
			return res.status(204).send(result);
		},
		function (error) {
			console.log('DEBUG (WARN): removeSubFolder:', error);
			//return res.send(500, error);
			return res.status(200).send(result);
		}
	);
};


// --------------------------------------------------------------------------------------
// createItemFolder: crea el directorio para almacenar el item de la collection.

function createItemFolder (req, res, next) {

	var folder = ParseReqRes.getItemFolder(req, res);

	console.log('DEBUG (INFO): createItemFolder:', folder);

	createDir(folder).done(

		function (result) {
			return next();
		},
		function (error) {
			console.log('DEBUG (ERR): createItemFolder:', error);
			return res.status(500).send(error);
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