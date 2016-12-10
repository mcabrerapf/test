(function ()
{
    'use strict';

    angular
        .module('app.pages.administration')
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
            customer: {
                name: '',
                logo: ''
            }
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
            // api.games.save(vm.newGame,
            //     function(success) {
            //         console.log('Yea!');
            //         console.log(success);
            //         closeDialog();
            //     },
            //     function(error) {
            //         alert(error.data.msg);
            //         console.error(error);
            //     });
        }



        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();