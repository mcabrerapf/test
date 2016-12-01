// --------------------------------------------------------------------------------------
// Middleware para la gestión de cualquier colección:
// acciones sobre la collection y sus items, asociadas a métodos HTTP o a rutas.
// 
// Esquema general:
//   function(req, res, next) { return error ? res.send(500, error) : next() }
//
// *** Utilidades genéricas ***
// --------------------------------------------------------------------------------------


'use strict';


var ensureAuth = [ensureAuthenticated, ensureAuthorized];


module.exports = {

	checkStatus: 			checkStatus,
	ensureAuth: 			ensureAuth,
    prepareData:            prepareData

};


// --------------------------------------------------------------------------------------
// Comprueba el status (OK o ERR) e informa de la causa del posible error.

function checkStatus (req, res, next) {

	var status = res.locals.status_code;
	var dataSend = {
		data: 		res.locals.bundle,
		msg: 		res.locals.bundle.errmsg, 	// Mensaje de error (en lenguaje técnico)
		message: 	'_Error_'					// Mensaje de error (en lenguaje coloquial)
	};

	if (isError(status)) {

		console.log('DEBUG (ERR): checkStatus:', dataSend);
		res.send(status, dataSend);
	} else {
		next();
	}
};


// --------------------------------------------------------------------------------------
// HTTP 1.1 codes: 4xx - client errors, 5xx - server errors

function isError (code) {	
	return (400 <= code && code <= 599);
};


// --------------------------------------------------------------------------------------
// Asegura que el usuario esté autenticado

function ensureAuthenticated (req, res, next) {
    return ( req.isAuthenticated() ? next() : res.send(401) );
};


// --------------------------------------------------------------------------------------
// Comprueba si el usuario tiene suficientes privilegios para acceder al recurso especificado
// Esta versión de la función únicamente aplica a las llamadas a la API (url's de tipo /api/collectionName)

function ensureAuthorized (req, res, next) {

    if (!req.user) return res.send(401);

	return next();

	// NO ESTA IMPLEMENTADO!!!!
	var urlParts = req.url.split('/');
	if (urlParts.length < 3) return next();

	var collectionName = urlParts[2];

	var _ = require('underscore');	
	var collections = require('../../database/collections').collections;

    var definition = collections[collectionName];
    if (definition) {
    	var accessLevel = _.findWhere(
    		definition.methods,
    		{ method: req.method.toLowerCase() }
    	).accessLevel || accessLevel.public;
    	if (!(accessLevel.bitMask & req.user.role.bitMask)) return res.send(403);
    }
    return next();
};


// --------------------------------------------------------------------------------------
// Establece valores por defecto para algunos campos en la base de datos

function prepareData (req, res, next) {
	var date = new Date;
	var user = req.user.email;

	if (req.route.methods.post) {
		req.body.created 	= date;
		req.body.createdBy 	= user;
		req.body.modified 	= date;
		req.body.modifiedBy = user;
	}
	if (req.route.methods.put) {
		req.body.modified 	= date;
		req.body.modifiedBy = user;
	}
	return next();
};