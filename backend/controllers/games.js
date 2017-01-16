// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'games'
// --------------------------------------------------------------------------------------

'use strict';

const 	accessLevel = require('../configuration/gamification').accessLevels
,       common 		= require('../controllers/common')
,       play 		= require('../controllers/play')

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
        },

        { path: 'kpidata.get',		middleware: play.getInput,  detail: true },

        // { path: 'kpidata.post',		middleware: play.addInput,  	detail: true },
        // { path: 'kpidata.put',		middleware: play.updateInput,  	detail: true },
        // { path: 'kpidata.delete',	middleware: play.deleteInput,  	detail: true },

        // { path: 'points.get',		middleware: play.getPoints,  	detail: true },
        // { path: 'points.post',		middleware: play.addPoints,  	detail: true },
        // { path: 'points.put',		middleware: play.updatePoints,  detail: true },
        // { path: 'points.delete',		middleware: play.deletePoints,  detail: true },

        // { path: 'winners.get',		middleware: play.getWinners,  	detail: true },
        // { path: 'winners.post',		middleware: play.addWinners,	detail: true },
        // { path: 'winners.put',		middleware: play.updateWinners,	detail: true },
        // { path: 'winners.delete',	middleware: play.deleteWinners, detail: true }

    ]

};
