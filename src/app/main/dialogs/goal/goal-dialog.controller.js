(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('GoalDialogController', GoalDialogController);

    /** @ngInject */
    function GoalDialogController($mdDialog, Element, timelineService, msUtils) {

        var vm = this;

        // Data
        vm.TITLEKEY = 'GOAL.EDIT_TITLE';
        vm.goal = angular.copy(Element);
        vm.newItem = false;

        if ( vm.goal._id === undefined ) {
            angular.extend(vm.goal, {
                data: {
                    description: '',
                    type: 'Money',
                    money: {
                        budget: 0,
                        participants: 0,
                        distributionTable: []
                    }
                }
            });

            vm.TITLEKEY = 'GOAL.NEW_TITLE';
            vm.newItem = true;
        }

        // Methods
        vm.addNew = addNew;
        vm.saveItem = saveItem;
        vm.closeDialog = closeDialog;

        //////////

        /**
         * Add new step
         */
        function addNew() {

            timelineService.addNew(vm.goal).then(function(response) {
                closeDialog(response);
            });
        }

        /**
         * Save step
         */
        function saveItem() {

            timelineService.saveItem(vm.goal).then(function(response) {
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
