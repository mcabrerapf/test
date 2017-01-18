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

        vm.kpis = vm.game.kpis.filter(function(kpi){
            return kpi.type == 'loaded';
        });

        vm.kpiData = vm.game.kpiData;

        vm.spreadsheetOptions = {
            toolbar:    false,
            sheetsbar:  false,
            columns:    1 + vm.kpis.length,
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
            vm.isSpreadsheetOK = true;
        };

        vm.saveSpreadsheet = function() {            
            // Calcular kpis calculated.
            // Grabar mediante api spreadsheet a game.kpiData
            saveKpiData( calculateKpis( vm.game.kpis ) );
        };

        //////////

        // $scope.$on('initLoadView', null);

        //////////

        function loadDataIntoSpreadsheet() {
            vm.spreadsheet.fromJSON({
                sheets: [ data2sheet(
                    vm.timelineEvent, vm.players, vm.kpis, vm.kpiData
                )]
            });
        };

        function calculateKpis(kpis) {
            var kpiData = {};
            /*
                Calcula los kpis calculated, a partir de los loadeds.
                Rellena así los huecos vacíos en el array kpis.
                Crea las propiedades de los nuevos kpis (calculated),
                en la estructura kpiData.
            */
            return kpiData;
        };

        function saveKpiData(kpiData) {
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

        function sheet2data(spreadsheet) {
            var kpiData = {};
            return kpiData;
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