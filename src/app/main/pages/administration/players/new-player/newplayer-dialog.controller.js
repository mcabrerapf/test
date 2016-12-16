(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.players')
        .controller('NewPlayerDialogController', NewPlayerDialogController);

    /** @ngInject */
    function NewPlayerDialogController($mdDialog, api)
    {
        var vm = this;

        // Methods
        vm.addNewPlayer = addNewPlayer;
        vm.closeDialog = closeDialog;

        /**
         * Add new game
         */
        function addNewPlayer()
        {

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