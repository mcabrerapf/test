(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('gameLoadViewController', gameLoadViewController)
        .directive('gameLoadView', gameLoadViewDirective);

    /** @ngInject */
    function gameLoadViewController($scope, api, gameService, $translate)
    {
        var vm = this;

        vm.existSpreadsheet = true; //false;
        vm.isSpreadsheetOK = false;

        vm.gameService = gameService;
        vm.game = vm.gameService.game;

        vm.timelineEvents = vm.game.timeline.filter(function(tlevent){
            return tlevent.type == 'Step' || tlevent.type == 'Goal';
        });

        vm.players = vm.game.players;

        vm.kpisLoaded = vm.game.kpis.filter(function(kpi){
            return kpi.type == 'loaded';
        });

        vm.kpisCalculated = vm.game.kpis.filter(function(kpi){
            return kpi.type == 'calculated';
        });

        vm.kpiDataDB = vm.game.kpiData;

		vm.onSpreadsheetChange = function(event) {
			$scope.$apply(function() {
				vm.isSpreadsheetOK = false;
				console.log('change');
			});
		};

        vm.spreadsheetOptions = {
        	change: 	vm.onSpreadsheetChange,
            toolbar:    true,
            sheetsbar:  false,
            columns:    1 + vm.kpisLoaded.length,
            rows:       1 + vm.players.length
        };

        vm.onTimelineEventChanged = function() {
        };

        vm.isTimelineEventDisabled = function(tlevent) {
            // Desactiva eventos que ya han terminado:
            return Date.now() > Date.parse(tlevent.end);
        };

/*
        vm.newSpreadsheet = function() {
        	vm.existSpreadsheet = true;
        	vm.isSpreadsheetOK = false;
        	var kpiData0 = newKpiData( vm.timelineEvent, vm.players, vm.kpisLoaded );
        	loadDataIntoSpreadsheet( kpiData0 );
        };
*/

        vm.loadSpreadsheet = function() {
        	vm.existSpreadsheet = true;
        	vm.isSpreadsheetOK = false;
        	loadDataIntoSpreadsheet( vm.kpiDataDB );
        };

        vm.validateSpreadsheet = function() {

        	var sheet = vm.spreadsheet.activeSheet();

        	vm.isSpreadsheetOK = checkKpisHeader(sheet,
        							function(kpi){
										return _.find( vm.kpisLoaded, {id: kpi} );
									}
  								) &&
        						 checkPlayersHeader(sheet,
        							function(player){
										return _.find( vm.players, function(p){ return p.user.employeeId == player } );
									}
  								) &&
        						 checkContents(sheet,
        							function(value){
										return Number.isFinite(value) || value === null;
									}
								);
        };

        vm.saveSpreadsheet = function() {        	
        	var kpiData  	= sheet2data( vm.spreadsheet.toJSON().sheets[0] )
        	,	kpiData0 	= newKpiData( vm.timelineEvent, vm.players, vm.kpisLoaded )

            saveKpiData( angular.merge( kpiData0, kpiData ) );
        };

        //////////

        $scope.$on('initLoadView', initLoadView());

        //////////

        function initLoadView() {
        };

        function loadDataIntoSpreadsheet(kpiData) {
            vm.spreadsheet.fromJSON({ sheets: [ data2sheet(
            	vm.timelineEvent, vm.players, vm.kpisLoaded, kpiData
            )] });
        };

        function calculateKpis(kpiData, kpisCalculated, kpisLoaded) {
        	var kpiDataItem = kpiData[ vm.timelineEvent._id ];

        	kpisCalculated.forEach(function(kCalc){

        		var numeratorId 	= _.find(kpisLoaded, { _id: kCalc.calculated.numerator }).id
        		,	denominatorId 	= _.find(kpisLoaded, { _id: kCalc.calculated.denominator }).id
        		,	divisionId 		= kCalc.id

        		if (kpiDataItem[divisionId] === undefined) kpiDataItem[divisionId] = {};

        		Object.keys(kpiDataItem[numeratorId]).forEach(function(player){

        			var numerator 	= kpiDataItem[numeratorId][player]
        			,	denominator = kpiDataItem[denominatorId][player]

        			kpiDataItem[divisionId][player] = denominator ? numerator / denominator : null;
        		});

        	});

            return kpiData;
        };

        function saveKpiData(kpiData) {
        	console.log('saveKpiData:', kpiData);
            /*
                Graba mediante api.games.kpidata.{post / put}
            */
        };
        
        function data2sheet(timelineEvent, players, kpis, kpiData) {

        	function getDataValue(kpi, player) {
    			return 	timelineEvent._id &&
			            kpiData[ timelineEvent._id ] &&
			            kpiData[ timelineEvent._id ][ kpi.id ] ?
			            kpiData[ timelineEvent._id ][ kpi.id ][ player.user.employeeId ] :
			            null;
        	};

            // header: row 0, column 0
            var sheet = {
                name: timelineEvent._id,
                rows: [{
                    cells: [{
                        value: timelineEvent.title, bold: true
                    }]
                }]
            };

            // header: row 0
            kpis.forEach(function(kpi){
                sheet.rows[0].cells.push({ value: kpi.id, bold: true });
            });

            // contents: row 1 ... players.length
            players.forEach(function(player){

                // header: column 0
                var row = { cells: [{ value: player.user.employeeId, bold: true }] };

                // contents: column 1 ... kpis.length
                kpis.forEach(function(kpi){
                    row.cells.push({ value: getDataValue(kpi, player) });
                });

                sheet.rows.push( row );
            });

            return sheet;
        };

        function sheet2data(sheet) {

            var kpiData = {}
            ,	kpis 	= []
            ,	player 	= "";

            sheet.rows.forEach(function(row){
                if (row.index == 0) {	// row.index 0: header (identificadores de tlevent y kpis)

                	row.cells.forEach(function(cellIdKpi){
                		var index = cellIdKpi.index;

		                if (index == 0) {
		                    kpiData[ sheet.name ] = {};						// crea nivel 1
		                } else {
		                    kpiData[ sheet.name ][ cellIdKpi.value ] = {};	// crea nivel 2
		                    kpis[ index+1 ] = cellIdKpi.value;
		                };                		
                	});

                } else {	// row 1..N: contents (identificadores de player y valor de kpis)

	                row.cells.forEach(function(cellValKpi){
	                	var index = cellValKpi.index;

	            		if (index == 0) {
	            			player = cellValKpi.value;
	            		} else {
	            			kpiData[ sheet.name ][ kpis[index+1] ][ player ] = cellValKpi.value;	// asigna valor (nivel 3)
	            		}
	                });
	            }
            });

            return kpiData;
        };

        // Comprueba que TODOS y cada uno de los valores de la estructura hacen cierta la función test()
        // Si falla alguno, indica las coordenadas del valor incorrecto.
        function checkEveryValue(kpiData, test) {

        	var check 	= true
        	,	value 	= undefined
        	,	reason 	= {}

        	Object.keys(kpiData).forEach(function(tlevent){
        		if (!check) return;
				Object.keys(kpiData[tlevent]).forEach(function(kpi){
        			if (!check) return;
					Object.keys(kpiData[tlevent][kpi]).forEach(function(player){
						if (!check) return;

						value = kpiData[tlevent][kpi][player];
						check = check && test(value);
						if (!check) {
							reason = { tlevent: tlevent, kpi: kpi, player: player, value: value };
						};
		        	});
	        	});
        	});

        	return {check: check, reason: reason};
        };

        function newKpiData(timelineEvent, players, kpis) {

            var kpiData = {};

            kpiData[ timelineEvent._id ] = {};

            kpis.forEach(function(kpi){
            	kpiData[ timelineEvent._id ][ kpi.id ] = {};

	            players.forEach(function(player){
	            	kpiData[ timelineEvent._id ][ kpi.id ][ player.user.employeeId ] = null;
	            });            	
            });

            return kpiData;
        };

        var minSheetRow 		= 0
        ,	minSheetColumn 		= 0
        ,	maxSheetRow 		= 1000
        ,	maxSheetColumn 		= 50
        ,	kpiHeaderRow		= minSheetRow
        ,	playerHeaderColumn	= minSheetColumn

        ,	KPI_HEADER_RANGE 	= 'B1:AA1'
        ,	PLAYER_HEADER_RANGE = 'A2:A100'
        ,	CONTENTS_RANGE 		= 'B2:AA100'

/*
        ,	KPI_HEADER_RANGE 	= rc(kpiHeaderRow, playerHeaderColumn + 1, kpiHeaderRow, maxSheetColumn)
        ,	PLAYER_HEADER_RANGE = rc(kpiHeaderRow + 1, playerHeaderColumn, maxSheetRow, playerHeaderColumn)
        ,	CONTENTS_RANGE 		= rc(kpiHeaderRow + 1, playerHeaderColumn + 1, maxSheetRow, maxSheetColumn)
*/

        function checkKpisHeader(sheet, test) {

        	var badKpis 	= []
        	,	colorOK		= "white"
        	,	colorERROR 	= "yellow"

			sheet.range(KPI_HEADER_RANGE).forEachCell(function (r, c, cell) {
				var rcCoords = rc(r, c);
				if (cell.value) {
					!test(cell.value) && badKpis.push({rcCoords: rcCoords, value: cell.value});
				} else {
					badKpis.push({rcCoords: rcCoords, value: undefined});
				}
		    });

			sheet.range(KPI_HEADER_RANGE).background(colorOK);

			badKpis.forEach(function(bKpi){
				//sheet.range( rc(kpiHeaderRow, bKpi, maxSheetRow, bKpi) ).background(colorERROR);
				sheet.range( bKpi.rcCoords ).background(colorERROR);
			});

			return badKpis.length == 0;
        };

        function checkPlayersHeader(sheet, test) {

        	var badPlayers 	= []
        	,	colorOK		= "white"
        	,	colorERROR 	= "orange"

			sheet.range(PLAYER_HEADER_RANGE).forEachCell(function (r, c, cell) {
				var rcCoords = rc(r, c);
				if (cell.value) {
					!test(cell.value) && badPlayers.push({rcCoords: rcCoords, value: cell.value});
				} else {
					badPlayers.push({rcCoords: rcCoords, value: undefined});
				};
		    });

			sheet.range(PLAYER_HEADER_RANGE).background(colorOK);

			badPlayers.forEach(function(bPlayer){
				//sheet.range( rc(bPlayer, playerHeaderColumn, bPlayer, maxSheetColumn) ).background(colorERROR);
				sheet.range( bPlayer.rcCoords ).background(colorERROR);
			});

			return badPlayers.length == 0;
        };

        function checkContents(sheet, test) {

        	var badValues 	= []
        	,	colorOK		= "white"
        	,	colorERROR 	= "red"

			sheet.range(CONTENTS_RANGE).forEachCell(function (r, c, cell) {
				var rcCoords = rc(r, c);
				cell.value && !test(cell.value) && badValues.push({rcCoords: rcCoords, value: cell.value});
		    });

			sheet.range(CONTENTS_RANGE).background(colorOK);

			badValues.forEach(function(bval){
				sheet.range( bval.rcCoords ).background(colorERROR);
			});

        	return badValues.length == 0;
        };

    	function rc(row, column, rowEnd, columnEnd) {

    		function numToAZ(x) {
    			// 0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, 26 -> AB, ...
    			var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    			return (x > 25 ? letters[parseInt(x / 26) - 1] : '')+ letters[x % 26]
    		};

    		return 	numToAZ(column) + (row + 1)
    				+ (rowEnd && columnEnd ? ':' + numToAZ(columnEnd) + (rowEnd + 1) : '');
    	};

    };


    /** @ngInject */
    function gameLoadViewDirective()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: 'gameLoadViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/games/directives/game-load-view/game-load-view.html'
        };
    };
})();