// --------------------------------------------------------------------------------------
// Gestión del FileSystem.
// Retornan Q.promise


'use strict';


module.exports = {
	//getStructureFolder: getStructureFolder,

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
var Q 					= require('q');
var Exec 				= require('./exec.js');
var ParseReqRes			= require('./parsereqres.js');

var E_ENOENT 	= 34;	// errno, cuando entrada no existe (man 2)


// --------------------------------------------------------------------------------------

/***
function getStructureFolder (req, res, next) {

	var fullPath = ParseReqRes.getSubFolder(req, res);

	console.log('DEBUG (INFO): getStructureFolder: [%s]', fullPath);

	if (fullPath === null) return res.status(500).send({msg: "invalid folder name"});

	return res.status(200).send( getFolderStructure( itemId, fullPath, baseUrl ) );
};
***/

/***
function folderStructure (req, res, next) {
	var baseUrl 		= req.path.toLowerCase();
	var collectionName 	= req.params.collectionName.toLowerCase();
	var itemId 			= (req.params.item || '').toLowerCase();

	var fullPath 		= Path.join( DATA_DIR, collectionName );

	//console.log('DEBUG (INFO): folderStructure:', collectionName, itemId);

	return res.send(200, getFolderStructure( itemId, fullPath, baseUrl ));
};


function getFolderStructure (folderName, path, baseUrl) {

	var folderSize		= 0;
	var folderNFiles	= 0;

	var structure = {
		name: 		folderName || Path.basename(path),	// itemId || collectionName
		type: 		'folder',
		size: 		0,			// Tamaño en bytes del contenido (recursivamente)
		nfiles: 	0,			// Número de archivos (no directorios) contenidos (recursivamente)
		path: 		baseUrl,
		entries: 	[]
	};

	path = path + '/' + folderName;

	if (FS.existsSync(path)) {

		var files = FS.readdirSync(path);

		for (var r = 0; r < files.length; r++) {

			var fileName = files[r];

			// Filtramos los archivos por inclusión:
			// Enumeramos todo aquello que SÍ nos interesa.
			// included: el fileName cumple uno de los patrones listados
			var included = [
				/^pag[0-9]+\.(html|jpg)$/,			// PDF
				/^output\.(mp4|jpg|png)$/,			// Video | Image
				/^portada\.(png|jpg)$/,				// Thumbnail
//				/^clip\.[^\.]+\.(pn|jpe?|sv)g$/i, 	// RSS Feeds Images
				/^clip\..+$/i, 						// RSS Feeds Images
				/^[0-9a-fA-F]{24}$/					// Directorio (itemId)
			].some(function(regex){
				return regex.test(fileName);
			});

			if (!included) continue;

			var stats = FS.statSync(path + '/' + fileName);
			if (stats.isDirectory()) {

				var folderStructure = getFolderStructure(fileName, path, baseUrl + '/' + fileName);
				structure.entries.push( folderStructure );

				folderSize += folderStructure.size;
				folderNFiles += folderStructure.nfiles;

			} else {

				var fileSize = stats.size;

				structure.entries.push({
					name: fileName,
					type: 'file',
					size: fileSize,
					path: baseUrl + '/' + fileName
				});

				folderSize += fileSize;
				folderNFiles++;

			}
		};
	}
	else {
		console.log('DEBUG (ERR): getFolderStructure: No existe path:', path);
	};

	structure.size = folderSize;
	structure.nfiles = folderNFiles;

	return structure;
};

***/

// --------------------------------------------------------------------------------------

function getStructure (folder) {
	var fname = 'getStructure';
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