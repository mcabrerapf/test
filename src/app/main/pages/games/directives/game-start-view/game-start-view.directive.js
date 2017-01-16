(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('gameStartViewController', gameStartViewController)
        .directive('gameStartView', gameStartViewDirective);

    /** @ngInject */
    function gameStartViewController($scope, api, gameService, $translate)
    {
        var vm = this;

        vm.gameDefinitionOK = isValidGameDefinition();

        // vm.gameService = gameService;
        // vm.game = vm.gameService.game;     


        //////////

        $scope.$on('initStartView', isValidGameDefinition);

        //////////

        function isValidGameDefinition() {
/***
            Elementos de la definición a VALIDAR:

            * KPIs que puntuan en el ranking sin descripción
            * KPIs calculados sobre otros KPIs que ya no existen
            * Equipos de jugadores que no están en el último nivel
            * Presupuesto sobrepasado
            * Equipos sin jugadores
            * Etapas solapadas
            * Eventos del timeline fuera de rango
            *       - Antes de la fecha actual
            *       - 
***/
            return true;
        };

    };


    /** @ngInject */
    function gameStartViewDirective()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: 'gameStartViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/games/directives/game-start-view/game-start-view.html'
        };
    };
})();