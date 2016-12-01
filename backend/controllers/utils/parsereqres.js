// --------------------------------------------------------------------------------------
// Funciones auxiliares para extraer valores de Request y Response
// Request.url: /api/collectionName/itemID.
// Response.locals.bundle: datos de la Response.
//
// El dato en Request/Response varía según el método HTTP llamado,
// y según el proceso before/after que se realice.
// P.e., POST /api/collectionName NO aporta info sobre el item recien creado,
// en Request.url; sin embargo, esta info sí que aparece en Response.locals.bundle._id


'use strict';


module.exports = {
	getCollectionName: 			getCollectionName,
	getItemID: 					getItemID,
	getCollectionFolder: 		getCollectionFolder,
	getCollectionFolderByName:	getCollectionFolderByName,
	getItemFolder: 				getItemFolder,
	getArrayFiles: 				getArrayFiles
};


var Path 				= require('path');
var	configuration 	    = require('../../configuration/gamification');


// Nota: __dirname es el directorio donde se encuentra el archivo actual (parsereqres.js)
var DATA_DIR = Path.join( __dirname, configuration.paths.dataDir );

function getCollectionName(req) {
	// collectionName es la base de la petición => ya existe en req.path
	return req.path.split('/')[2];
};

function getItemID(req, res) {
	// Busca itemID en los siguientes datos:
	// req.path, parámetro id (detail=true), en el POST (body), o en la response
	// AVISO: El orden de búsqueda se ha de comprobar por si es el más adecuado.

	//return ( req.body._id || req.path.split('/')[3] || req.params.id || res.locals.bundle._id ).toString();
	return ( req.path.split('/')[3] || req.params.id || req.body._id || res.locals.bundle._id ).toString();
};

function getCollectionFolder(req) {
	return Path.join(DATA_DIR, getCollectionName(req));
};

function getCollectionFolderByName(collectionName) {
	return Path.join(DATA_DIR, collectionName);
};

function getItemFolder(req, res, modules) {
	var collectionName 	= getCollectionName(req);
	var itemID 			= getItemID(req, res);
	var docId 			= req.query.docid || '';

	if (modules) {
		itemID = UtilsDB.getIdModelName( collectionName );
		collectionName = 'modules';
	};

	return Path.join( DATA_DIR, collectionName, itemID, docId );
};

function getArrayFiles (req) {
	var files = req.files.files;
	return ( Array.isArray(files[0]) ? files[0] : files );
};

