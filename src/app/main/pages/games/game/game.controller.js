(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('GameController', GameController);

    /** @ngInject */
    function GameController($rootScope, $q, $state, $mdDialog, $translate, gameService)
    {
        var vm = this;

        // Data
        vm.gameService = gameService;
        vm.game = vm.gameService.game;
        vm.gameCopy = angular.copy(vm.game);


        // Methods
        vm.gotoGames = gotoGames;
        vm.deleteConfirm = deleteConfirm;
        vm.renameGame = renameGame;
        vm.initBudgetManager = initBudgetManager;


        init();


        function init() {
        }



        /**
         * Update theme (name)
         */
        function renameGame(newName) {

            return gameService.rename(newName).then(function() {
                vm.gameCopy.name = newName;
                return true;
            }, function(error) {
                vm.gameCopy.name = vm.game.name;
                return false;
            });
        }


        /**
         * Delete Confirm Dialog
         */
        function deleteConfirm(ev)
        {
            $translate([
                'FORMS.DELETECONFIRMATION.TITLE',
                'FORMS.DELETECONFIRMATION.DETAIL',
                'FORMS.DELETECONFIRMATION.ARIAL',
                'FORMS.CANCEL',
                'FORMS.OK']).then(function (translationValues) {

                var confirm = $mdDialog.confirm()
                    .title(translationValues['FORMS.DELETECONFIRMATION.TITLE'])
                    .htmlContent(translationValues['FORMS.DELETECONFIRMATION.DETAIL'])
                    .ariaLabel(translationValues['FORMS.DELETECONFIRMATION.ARIAL'])
                    .targetEvent(ev)
                    .ok(translationValues['FORMS.OK'])
                    .cancel(translationValues['FORMS.CANCEL']);

                $mdDialog.show(confirm).then(function () {

                    gameService.remove().then(function() {
                        vm.gotoGames();
                    });
                });

            });
        }


        /**
         * Go to games page
         */
        function gotoGames()
        {
            $state.go('app.games');
        }

        /**
         * Advice to treemap-viewer directive
         */
        function initBudgetManager($event) {

            $rootScope.$broadcast('initTreeMapViewer');
        }
    }
})();
