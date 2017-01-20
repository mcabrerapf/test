// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'games'
// --------------------------------------------------------------------------------------

'use strict';

const 	accessLevel = require('../configuration/gamification').accessLevels,
        common 		= require('../controllers/common'),
        Game        = require('../database/database').models['game'];

module.exports = {

    collectionRoutes: [
        {   path: 'start',          middleware: startGame,      detail: true },

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


/**
 * /api/games/:id/start
 * 
 * Inicia la partida:
 *      Modifica el estado a 'started'
 *      Genera las estructuras necesarias para albergar los resultados, puntos, premios, ...
 * 
 */
function startGame(req, res, next) {

    Game.findOne({_id: req.params.id}, function(error, game) {

        if (error) return res.status(500).send(error);

        if (game.status !== 'definition') return res.status(500).send('No se puede iniciar. La partida no está en definición.');

        var kpiData = getInitialKpiData(game);

        Game.update({_id: req.params.id}, {$set: {

                status: 'started',
                kpiData: kpiData

            }}).exec(function(error, result) {

                if (error) return res.status(500).send(error);

                // NOTA: Es necesario registrar en el LOG que "este usuario" ha iniciado la partida

                // Recuperamos la partida iniciada y la retornamos
                Game.findOne({_id: req.params.id}, function(error, game) {

                    if (error) return res.status(500).send(error);
                    res.status(200).send(game);

                });
            });
    });

}   // startGame


/**
 * Retorna la estructura inicial de kpiData para una partida+
 * La estructura se construye para todas las etapas, todos los kpis y todos los jugadores
 */
function getInitialKpiData(game) {

    var kpiData = {};
    var steps = game.timeline.filter(function(event) { return event.type==='Step' });

    // todas las etapas
    steps.forEach(function(step) {

        kpiData[step._id] = {};

        // todos los kpis
        game.kpis.forEach(function(kpi) {

            kpiData[step._id][kpi.id] = {};

            // todos los jugadores
            game.players.forEach(function(player) {

                kpiData[step._id][kpi.id][player.user.employeeId] = null;

            });
        });

    });

    return kpiData;
}
