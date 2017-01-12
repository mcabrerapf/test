(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('StepDialogController', StepDialogController);

    /** @ngInject */
    function StepDialogController($mdDialog, Element, timelineService, msUtils) {

        var vm = this;

        // Data
        vm.TITLEKEY = 'STEP.EDIT_TITLE';
        vm.step = angular.copy(Element);
        vm.newStep = false;

        if ( vm.step._id === undefined ) {
            angular.extend(vm.step, {
                data: {
                    description: '',
                    location: {
                        address: undefined,
                        longitud: undefined,
                        latitud: undefined
                    },
                    images: undefined
                }
            });

            vm.TITLEKEY = 'STEP.NEW_TITLE';
            vm.newStep = true;
        }

        // Methods
        vm.addNew = addNew;
        vm.saveStep = saveStep;
        vm.closeDialog = closeDialog;

        //////////

        /**
         * Add new step
         */
        function addNew() {

            timelineService.addNew(vm.step).then(function(response) {
                closeDialog(response);
            });
        }

        /**
         * Save step
         */
        function saveStep() {

            timelineService.saveItem(vm.step).then(function(response) {
                closeDialog(response);
            });
        }


        /**
         * Close dialog
         */
        function closeDialog(retValue)
        {
            $mdDialog.hide(retValue);
        }

    }
})();
