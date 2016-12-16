(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.users')
        .controller('NewUserDialogController', NewUserDialogController);

    /** @ngInject */
    function NewUserDialogController($mdDialog, api)
    {
        var vm = this;

        // Data
        vm.minDate = new Date();

        // Methods
        vm.addNewUser = addNewUser;
        vm.closeDialog = closeDialog;

        /**
         * Add new game
         */
        function addNewUser()
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