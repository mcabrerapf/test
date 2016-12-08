(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('NewThemeDialogController', NewThemeDialogController);

    /** @ngInject */
    function NewThemeDialogController($mdDialog, api)
    {
        var vm = this;
        
        vm.newItem = {
            name: ''
        };

        // Methods
        vm.addNew = addNew;
        vm.closeDialog = closeDialog;


        /**
         * Add new theme
         */
        function addNew()
        {
            api.themes.save(vm.newItem,
                function(theme) {
                    closeDialog(theme);
                },
                function(error) {
                    alert(error.data.errmsg || error.data.data.errmsg);
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