(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('NewGameDialogController', NewGameDialogController);

    /** @ngInject */
    function NewGameDialogController($mdDialog, api)
    {
        var vm = this;

        // Data
        vm.minDate = new Date();
        
        vm.newGame = {
            name: '',
            status: 'En definición',
            customer: ''
        };

        // Methods
        vm.addNewGame = addNewGame;
        vm.closeDialog = closeDialog;
        vm.loadThemes = loadThemes;

        vm.loadThemes();
        
        //////////
        function loadThemes() {
            return api.themes.find(function(themes) {
                vm.themes = themes;
            });
        }

        /**
         * Add new game
         */
        function addNewGame()
        {
            api.games.save(vm.newGame,
                function(game) {
                    closeDialog(game);
                },
                function(error) {
                    alert(error.data.msg);
                    console.error(error);
                });
        }



        /**
         * Close dialog
         */
        function closeDialog(result)
        {
            $mdDialog.hide(result);
        }

    }
})();