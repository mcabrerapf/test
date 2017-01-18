(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('gamePlayersViewController', gamePlayersViewController)
        .directive('gamePlayersView', gamePlayersViewDirective);

    /** @ngInject */
    function gamePlayersViewController($scope, gameService, $translate)
    {
        var vm = this;
        
        vm.gameService = gameService;


        //////////


    };


    /** @ngInject */
    function gamePlayersViewDirective()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: 'gamePlayersViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/games/directives/game-players-view/game-players-view.html'
        };
    };
})();