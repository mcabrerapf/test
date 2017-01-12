// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'games'
// --------------------------------------------------------------------------------------

'use strict';

var accessLevel 		= require('../configuration/gamification').accessLevels;
var common              = require('../controllers/common');

module.exports = {

    collectionRoutes: [
        {
            path: 'kpis',
            submodel: true,
            detail: true,
            methods: 		[
                { method: 'get', 		before: [common.ensureAuth], accessLevel: accessLevel.editor },
                { method: 'post', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'put', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'delete',		before: [common.ensureAuth], accessLevel: accessLevel.editor }
            ],
        },
        {
            path: 'timeline',
            submodel: true,
            detail: true,
            methods: [
                { method: 'get',        before: [common.ensureAuth], accessLevel: accessLevel.editor },
                { method: 'post', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'put', 		before: [common.ensureAuth, common.prepareData], accessLevel: accessLevel.editor },
                { method: 'delete',		before: [common.ensureAuth], accessLevel: accessLevel.editor }
            ]
        }
    ]

};
