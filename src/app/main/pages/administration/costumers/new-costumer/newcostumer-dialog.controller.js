(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.costumers')
        .controller('NewCostumerDialogController', NewCostumerDialogController);

    /** @ngInject */
    function NewCostumerDialogController($mdDialog, api)
    {
        var vm = this;

        // Methods
        vm.closeDialog = closeDialog;

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

    }
})();