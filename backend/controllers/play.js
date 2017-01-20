// --------------------------------------------------------------------------------------
//  Middleware específico de la collection 'game': Funciones del desarrollo del juego.

// MOVER A game.js!!
// --------------------------------------------------------------------------------------

'use strict';

module.exports = {
    getInput:   getInput
};

const   Game 			= require('../database/database').models['game']
,       ParseReqRes 	= require('./utils/parsereqres.js')


// --------------------------------------------------------------------------------------
// PlayData: estructura tipo {idTimelineEvent: {idKpi: {idPlayer1: value1, ... idPlayerN: valueN}}}
//
//  idTimelineEvent:    evento del Timeline (step o goal)
//  idKpi:              kpi que se aplica (de los que generan puntos)
//  idPlayer:           jugador


// --------------------------------------------------------------------------------------
// setItemPlayData

function setItemPlayData(structure, idTimelineEvent, idKpi, idPlayer, value) {

	if (structure === undefined) structure = {};
	if (structure[idTimelineEvent] === undefined) structure[idTimelineEvent] = {};
	if (structure[idTimelineEvent][idKpi] === undefined) structure[idTimelineEvent][idKpi] = {};

	structure[idTimelineEvent][idKpi][idPlayer] = value;

	return structure;
};


// --------------------------------------------------------------------------------------
// getPartPlayData: Accede a partes de las estructuras tipo playData: game.kpiData, game.points, game.winners
//
// salida:              Objecto, parte de la estructura playData:
//                      playData || playData.timelineEvent || playData.timelineEvent.kpi || playData.timelineEvent.kpi.player

function getPartPlayData(structure, idTimelineEvent, idKpi, idPlayer) {

	if (structure === undefined) return undefined;
	else if (idTimelineEvent === undefined && idKpi === undefined && idPlayer === undefined)	return structure;
	else if (idKpi === undefined && idPlayer === undefined)	return structure[idTimelineEvent];
	else if (idPlayer === undefined)	return structure[idTimelineEvent][idKpi];
	else	return structure[idTimelineEvent][idKpi][idPlayer];

};


// --------------------------------------------------------------------------------------
// getInput: retorna toda la estructura game.kpiData

function getInput(req, res) {

    const   itemId  = ParseReqRes.getItemID(req, res)

    console.log('DEBUG (INFO): getInput: [%s]', itemId);

    Game.findOne({ _id: itemId }).then(

    	function (result) {
        	return res.status(200).send( result.kpiData );
        },
        function (error) {
			console.log('DEBUG (ERR): getInput:', error);
			return res.status(400).send( error );
        }

    )
}


// --------------------------------------------------------------------------------------

/***
        function runTimeline (timeline) {

            timeline.forEach(function(timelineEvent){
                evalTimelineEvent( timelineEvent );
            })

        };

        function evalTimelineEvent (timelineEvent) {

            switch (timelineEvent.type) {
                case 'Step':
                    console.log('evalTimelineEvent: Step');
                    break;
                case 'Message':
                    console.log('evalTimelineEvent: Message');
                    break;                    
                default;
                    console.log('evalTimelineEvent: ERROR: incorrect type');
            }

        };
***/
