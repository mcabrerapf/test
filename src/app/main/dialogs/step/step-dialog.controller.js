(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('StepDialogController', StepDialogController);

    /** @ngInject */
    function StepDialogController($mdDialog, Element, Container, msUtils)
    {
        var vm = this;

        // Data
        vm.TITLEKEY = 'STEP.EDIT_TITLE';
        vm.step = angular.copy(Element);
        vm.stepsContainer = Container;
        vm.newStep = false;

        if ( !vm.step )
        {
            vm.step = {
                _id: new Date().valueOf(),
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
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new step
         */
        function addNew()
        {
//            vm.stepsContainer.unshift(vm.step);
            vm.stepsContainer.push(vm.step);


            closeDialog(vm.step);
        }

        /**
         * Save step
         */
        function saveStep()
        {
            // Dummy save action
            for ( var i = 0; i < vm.stepsContainer.length; i++ )
            {
                if ( vm.stepsContainer[i]._id === vm.step._id )
                {
                    vm.stepsContainer[i] = angular.copy(vm.step);
                    break;
                }
            }

            closeDialog(vm.step);
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
