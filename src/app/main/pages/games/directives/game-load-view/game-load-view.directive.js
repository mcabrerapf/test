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

        vm.gameService = gameService;
        vm.game = vm.gameService.game;

        vm.timelineEvents = vm.game.timeline.filter(function(tlevent){
            return tlevent.type == 'Step' || tlevent.type == 'Goal';
        });

        vm.players = vm.game.players;

        vm.kpis = vm.game.kpis.filter(function(kpi){
            return kpi.type == 'loaded';
        });

        /* TODO:

            1) Formatear la hoja de cálculo para tener tantas filas como vm.players
            y tantas columnas como vm.kpis.

            2) Una vez rellena la tabla:
            
                2.1) Validar tabla
                2.2) Calcular kpis calculated.
                2.3) Guardar en bbdd, en la estructura: game.kpiData.

        */

        vm.spreadsheetOptions = {
            sheets: [{
                name: "",
                mergedCells: [],
                rows: [{
                    height: 0,
                    cells: [{}]
                }]
            }]
        };

        vm.isDisabled = function(tlevent) {
            // Desactiva eventos que ya han terminado:
            return Date.now() > Date.parse(tlevent.end);
        };

        //////////

        // $scope.$on('initLoadView', getTimelineEvents());

        //////////

/***
        function getTimelineEvents() {
            api.games.timeline.find(
                {
                    id:     vm.game._id
                },

                function (result) {
                    console.log('getTimelineEvents: OK', result);
                    vm.timelineEvents = result.filter(function(tlevent){
                        return tlevent.type == 'Step' || tlevent.type == 'Goal';
                    });
                },
                function (error) {
                    console.log('getTimelineEvents: ERROR', error);
                }                    
            );
        };
***/

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