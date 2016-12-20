
'use strict';

var configuration       = require('../configuration/gamification').configuration;
var accessLevel 		= require('../configuration/gamification').accessLevels;

// middleware para la gestión de colecciones (uso general)
var common              = require('../controllers/common');
var filesystem          = require('../controllers/utils/filesystem');

// middleware específico para la gestión de colecciones
var themes   	        = require('../controllers/themes.js');
var games 			    = require('../controllers/games.js');
var kpis                = require('../controllers/kpis.js');
var users               = require('../controllers/users.js');
var distributions       = require('../controllers/distributions.js');
var customers           = require('../controllers/customers.js');
var teams               = require('../controllers/teams.js');

var collections = {

    // Módulos (opciones de menú de la interfície de la aplicación)

    'themes': {
        model:			'theme',
        methods:		[
            { method: 'get', 		before: [common.ensureAuth],
                                    accessLevel: accessLevel.public },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData],
                                    after:	[common.checkStatus, filesystem.createItemFolder],
                                    accessLevel: accessLevel.editor },
            { method: 'put', 		before:	[common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'delete',		before:	[common.ensureAuth],
                                    after:	[filesystem.removeItemFolder],
                                    accessLevel: accessLevel.editor }
        ],
        routes:			themes.collectionRoutes,
        interfaceRest:	true
    },
    
    'games': {
        model:			'game',
        methods:		[
            { method: 'get', 		before: [common.ensureAuth],
                                    accessLevel: accessLevel.public },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData],
                                    after:	[common.checkStatus, filesystem.createItemFolder],
                                    accessLevel: accessLevel.editor },
            { method: 'put', 		before:	[common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'delete',		before:	[common.ensureAuth],
                                    after:	[filesystem.removeItemFolder],
                                    accessLevel: accessLevel.editor }
        ],
        routes:			games.collectionRoutes,
        interfaceRest:	true
    },
    
    'kpis': {
        model:			'kpi',
        methods:		[
            { method: 'get', 		before: [common.ensureAuth],
                                    accessLevel: accessLevel.public },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'put', 		before:	[common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'delete',		before:	[common.ensureAuth],
                                    accessLevel: accessLevel.editor }
        ],
        routes:			kpis.collectionRoutes,
        interfaceRest:	true
    },

    'distributions': {
        model:			'distribution',
        methods:		[
            { method: 'get', 		before: [common.ensureAuth],
                                    accessLevel: accessLevel.public },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'put', 		before:	[common.ensureAuth, common.prepareData],
                                    accessLevel: accessLevel.editor },
            { method: 'delete',		before:	[common.ensureAuth],
                                    accessLevel: accessLevel.editor }
        ],
        routes:			distributions.collectionRoutes,
        interfaceRest:	true
    },
    
    'users': {
        model: 			'user',
        methods: 		[
            { method: 'get', 		before: [common.ensureAuth],
                                    after:  [users.hidePassword],
                                    accessLevel: accessLevel.editor },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.admin },
            { method: 'put', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.admin },
            { method: 'delete',		before: [common.ensureAuth], accessLevel: accessLevel.admin }
        ],
        routes:         users.collectionRoutes,
        interfaceRest: 	true
    },

    'customers': {
        model: 'customer',
        methods: [
            { method: 'get', 		before: [common.ensureAuth], accessLevel: accessLevel.public },
            { method: 'post', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.admin },
            { method: 'put', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.admin },
            { method: 'delete',		before: [common.ensureAuth], accessLevel: accessLevel.admin }
        ],
        routes: customers.collectionRoutes,
        interfaceRest: 	true
    }
};


// --------------------------------------------------------------------------------------
// Crea los puntos de acceso REST iniciales
// app: 				objeto app Express
// models: 	            relación de models de la base de datos

function setup(app, models) {

    // --------------------------------------------------
    // Para las colecciones estáticas (de sistema) ...

    for (var name in collections) {

        const   collection  = collections[name]
        ,       model       = models[collection.model]

        makeREST(app, name, collection, model, configuration.apiUrl);

    };

};


/////////////////////////////////////////////////////////////////////////////////////////////////
function makeREST(app, name, definition, model, baseUrl) {

    if (model === undefined) {
        throw new Error('Model not found ' + definition.model);
    }

    if (definition.methods) {
        model.methods(definition.methods);
    }

    if (definition.routes) {
        definition.routes.forEach(function(route) {          

            const fnHandler = route.detail === undefined ?
                route.middleware :
                {
                    detail:     route.detail,
                    handler:    route.middleware
                };

            model.route( route.path, fnHandler );
        });
    }

    const url = baseUrl + '/' + name;
    model.register(app, url);

}


module.exports = {
    setup: 				setup,
    collections:        collections
};
