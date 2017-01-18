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

        vm.kpiData = vm.game.kpiData;

        vm.spreadsheetOptions = {
            toolbar:    false,
            sheetsbar:  false,
            columns:    1 + vm.kpisLoaded.length,
            rows:       1 + vm.players.length
        };

        vm.onTimelineEventChanged = function() {
            loadDataIntoSpreadsheet();
        };

        vm.isTimelineEventDisabled = function(tlevent) {
            // Desactiva eventos que ya han terminado:
            return Date.now() > Date.parse(tlevent.end);
        };

        vm.validateSpreadsheet = function() {
        	var kpiData = sheet2data( vm.spreadsheet.toJSON().sheets[0] );

			var checkData = checkEveryValue(kpiData, function(value){
				return Number.isFinite(value) || value === null;
			});

			vm.isSpreadsheetOK 	= checkData.check;
			vm.errSpreadsheet 	= checkData.reason;
        };

        vm.saveSpreadsheet = function() {
        	var kpiData = sheet2data( vm.spreadsheet.toJSON().sheets[0] );

            saveKpiData( calculateKpis( kpiData, vm.kpisCalculated, vm.kpisLoaded ) );
        };

        //////////

        // $scope.$on('initLoadView', null);

        //////////

        function loadDataIntoSpreadsheet() {
            vm.spreadsheet.fromJSON({
                sheets: [ data2sheet(
                    vm.timelineEvent, vm.players, vm.kpisLoaded, vm.kpiData
                )]
            });
        };

        function calculateKpis(kpiData, kpisCalculated, kpisLoaded) {
        	var kpiDataItem = kpiData[ vm.timelineEvent._id ];

        	kpisCalculated.forEach(function(kCalc){

        		var numeratorId 	= _.find(kpisLoaded, { _id: kCalc.calculated.numerator }).id
        		,	denominatorId 	= _.find(kpisLoaded, { _id: kCalc.calculated.denominator }).id
        		,	divisionId 		= kCalc.id

        		if (kpiDataItem[divisionId] === undefined) kpiDataItem[divisionId] = {};

        		Object.keys(kpiDataItem[numeratorId]).forEach(function(player){
        			kpiDataItem[divisionId][player] =
        				kpiDataItem[numeratorId][player] / kpiDataItem[denominatorId][player];
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

            // header: row 0, column 0
            var sheet = {
                name: timelineEvent._id,
                frozenRows: 1,
                frozenColumns: 1,
                rows: [{
                    cells: [{
                        value: timelineEvent.title, bold: true, enable: false 
                    }]
                }]
            };

            // header: row 0
            kpis.forEach(function(kpi){
                sheet.rows[0].cells.push({ value: kpi.id, bold: true, enable: false });
            });

            // contents: row 1 ... players.length
            players.forEach(function(player, i){

                // header: column 0
                var row = { cells: [{ value: player.user.employeeId, bold: true, enable: false }] };

                // contents: column 1 ... kpis.length
                kpis.forEach(function(kpi){

                    const value =   timelineEvent._id &&
                                    kpiData[ timelineEvent._id ] &&
                                    kpiData[ timelineEvent._id ][ kpi.id ] ?
                                    kpiData[ timelineEvent._id ][ kpi.id ][ player.user.employeeId ] :
                                    null;

                    row.cells.push({ value: value });
                    /*, validation: {type: "reject", allowNulls: true, dataType: "number"} */
                    // console.log('value: ', value);
                });

                sheet.rows.push( row );
            });

            return sheet;
        };

        function sheet2data(sheet) {

            var kpiData = {}
            ,	kpis 	= []
            ,	player 	= "";

            sheet.rows.forEach(function(row, r){
                if (r == 0) {	// row 0: header (identificadores de tlevent y kpis)

                	row.cells.forEach(function(cellIdKpi, i){
		                if (i == 0) {
		                    kpiData[ sheet.name ] = {};						// crea nivel 1
		                } else {
		                    kpiData[ sheet.name ][ cellIdKpi.value ] = {};	// crea nivel 2
		                    kpis[i] = cellIdKpi.value;
		                };                		
                	});

                } else {	// row 1..N: contents (identificadores de player y valor de kpis)

	                row.cells.forEach(function(cellValKpi, j){
	            		if (j == 0) {
	            			player = cellValKpi.value;
	            		} else {
	            			kpiData[ sheet.name ][ kpis[j] ][ player ] = cellValKpi.value;	// asigna valor (nivel 3)

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