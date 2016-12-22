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

        if ( !vm.step )
        {
            vm.step = {
                title: '',
                type: 'Step',
                start: new Date(),
                data: {
                    description: '',
                    location: {
                        address: undefined,
                        longitud: undefined,
                        latitud: undefined
                    },
                    images: undefined
                }
            };

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

            timelineService.addNew(vm.step);
            timelineService.save().then(function() {
                closeDialog();
            });
        }

        /**
         * Save step
         */
        function saveStep() {

            timelineService.saveItem(vm.step);
            timelineService.save().then(function() {
                closeDialog();
            });
        }


        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide(vm.step);
        }

    }
})();
