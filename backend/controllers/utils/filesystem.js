// --------------------------------------------------------------------------------------
// Gestión del FileSystem.
// Retornan Q.promise


'use strict';


module.exports = {
	listRootFolder: 	listRootFolder,

	createItemFolder: 	createItemFolder,
	removeItemFolder:   removeItemFolder,
	createSubFolder: 	createSubFolder,
	deleteFolder: 		deleteFolder,
	deleteFile: 		deleteFile,
	renameEntryFS: 		renameEntryFS,

	blank2hyphen: 		blank2hyphen,
	normalize: 			normalize,
	renameFile: 		renameFile,
	removeFile: 		removeFile,
	removeFileGlob:		removeFileGlob,
	createDir: 			createDir,		// mkdir(), mkdir -p 	# genera directorios padres si no existen
	cleanDir: 			cleanDir,		// rm -rf dir/*			# sólo contenido del directorio, recursivamente
	removeDir: 			removeDir		// rm -rf dir 			# directorio y su contenido su directorio, recursivamente
};

const 	E_ENOENT 		= 34	// errno, cuando entrada no existe (man 2)

,		Fs 				= require('fs')
,		Path 			= require('path')
,		Q 				= require('q')
,		Exec 			= require('./exec.js')
,		ParseReqRes		= require('./parsereqres.js')


// --------------------------------------------------------------------------------------

function listRootFolder (req, res) {

	const 	folder 	= ParseReqRes.getItemFolder(req, res)

	console.log('DEBUG (INFO): listDirectory: [%s]', folder);

	return res.status(200).send( dumpDirectory( folder, '/' ) );
};


// --------------------------------------------------------------------------------------

function dumpDirectory (baseDir, subDir) {
	//console.log('DEBUG (INFO): dumpDirectory: [%s | %s]', baseDir, subDir);

	const 	fullPath 	= Path.join( baseDir, subDir );
	var 	dump 		= [];

	if (Fs.existsSync( fullPath )) {
		const entries = Fs.readdirSync( fullPath );

		entries.forEach(function(entry){
			if (entry == '.' || entry == '..') return;

			const 	entryPath		= Path.join( subDir, entry )
			,		entryFullPath 	= Path.join( baseDir, entryPath )
			,		stats 			= Fs.statSync( entryFullPath )

			var		fileProperties	= {
										name: 		entry,
										path: 		entryPath,
										fullPath: 	entryFullPath,	// sólo útil en fase desarrollo
										mtime: 		stats.mtime
									  }

			if (stats.isDirectory()) {
				fileProperties.type = 'folder';
				fileProperties.contents = dumpDirectory( baseDir, entryPath );	// Explora recursivamente
			} else {
				fileProperties.type = typeByExtension( entry );
				fileProperties.size = stats.size;
			};

			dump.push( fileProperties );
		});
	};

	return dump;
};


// --------------------------------------------------------------------------------------

function typeByExtension (fileName) {
	const 	ext 	= Path.extname( fileName ).toLowerCase();
	var		type 	= 'unknown';
			
	if ( /^\.(bmp|gif|jpe?g|png|svg)$/i.test( ext ) )		{ type = 'image'; }
	else if ( /^\.(html?|s?css|sass|xml)$/i.test( ext ) )	{ type = 'html'; }
	else if ( /^\.pdf$/i.test( ext ) )						{ type = 'pdf'; }
	else if ( /^\.(txt|doc)$/i.test( ext ) )				{ type = 'doc'; }

	return type;
};


// --------------------------------------------------------------------------------------

function createSubFolder (req, res) {

	const 	baseDir 	= ParseReqRes.getItemFolder(req, res)
	,		subDir 		= ParseReqRes.getPostParam(req, 'path')
	,		fullPath 	= Path.join( baseDir, subDir )

	console.log('DEBUG (INFO): createSubFolder: [%s]', fullPath);

	createDir( fullPath ).done(

		function () {
			const result = {
				name: 		Path.basename(subDir),
				path: 		subDir,
				fullPath: 	fullPath
			};
			return res.status(201).send(result);
		},
		function (error) {
			console.log('DEBUG (ERR): createSubFolder:', error);
			return res.status(500).send(error);
		}
	);
};


// --------------------------------------------------------------------------------------

function deleteEntryFS (req, res) {

	const 	baseDir 	= ParseReqRes.getItemFolder(req, res)
	,		path 		= ParseReqRes.getQueryParam(req, 'path')
	,		fullPath 	= Path.join( baseDir, path )

	console.log('DEBUG (INFO): deleteEntryFS: [%s]', fullPath);

	(req.typeEntryFS == 'folder' ? removeDir : removeFile)( fullPath ).done(

		function () {
			const result = {
				name: 		Path.basename( path ),
				path: 		path,
				fullPath: 	fullPath
			};
			return res.status(204).send(result);
		},
		function (error) {
			console.log('DEBUG (ERR): deleteEntryFS:', error);
			return res.status(500).send(error);
		}
	);
};


// --------------------------------------------------------------------------------------

function deleteFolder (req, res) {
	req.typeEntryFS = 'folder';
	deleteEntryFS( req, res );
};

function deleteFile (req, res) {
	req.typeEntryFS = 'file';
	deleteEntryFS( req, res );
};


// --------------------------------------------------------------------------------------

function renameEntryFS (req, res) {

	const 	baseDir 	= ParseReqRes.getItemFolder(req, res)
	,		oldPath 	= ParseReqRes.getPostParam(req, 'oldpath')
	,		newPath 	= ParseReqRes.getPostParam(req, 'newpath')
	,		oldFullPath = Path.join( baseDir, oldPath )
	,		newFullPath = Path.join( baseDir, newPath )

	console.log('DEBUG (INFO): renameEntryFS: [%s] -> [%s]', oldFullPath, newFullPath);

	renameFile( oldFullPath, newFullPath ).done(

		function () {
			const result = {
				name: 		Path.basename( newPath ),
				path: 		Path.normalize( newPath ),
				type: 		typeByExtension( newPath ),
				fullPath: 	newFullPath
			};
			
			return res.status(201).send(result);
		},
		function (error) {
			console.log('DEBUG (ERR): renameEntryFS:', error);
			return res.status(500).send(error);
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
	return Exec.execCommand('/bin/mkdir -p "' + dirName + '"');
};


function cleanDir(dirName) {
	return Exec.execCommand('/bin/rm -rf "' + dirName + '"/*');
};


function removeDir(dirName) {
	return Exec.execCommand('/bin/rm -rf "' + dirName + '"');
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