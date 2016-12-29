(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('KpiDialogController', KpiDialogController);

    /** @ngInject */
    function KpiDialogController($mdDialog, $translate, Kpi, gameService) {

        var vm = this;
        vm.kpiTypes = [
            'calculated', 'loaded'
        ];

        // Data
        vm.TITLEKEY = 'KPIS.EDIT_TITLE';
        vm.kpi = angular.copy(Kpi);
        vm.newItem = false;

        if ( !vm.kpi )
        {
            vm.kpi = {
                name: '',
                id: '',
                type: 'loaded',
            };

            vm.TITLEKEY = 'KPIS.NEW_TITLE';
            vm.newItem = true;
        }

        // Methods
        vm.addNew = addNew;
        vm.saveItem = saveItem;
        vm.closeDialog = closeDialog;
        vm.deleteKpi = deleteKpi;

        //////////

        /**
         * Add new
         */
        function addNew() {

            gameService.addKpi(vm.kpi).then(function(newKpi) {
                closeDialog(newKpi);
            });
        }

        /**
         * Save
         */
        function saveItem() {

            gameService.updateKpi(vm.kpi).then(function(updatedKpi) {
                closeDialog(updatedKpi);
            });
        }


        /**
         * Delete kpi
         */
        function deleteKpi(event) {
            closeDialog('removeKpi');
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
