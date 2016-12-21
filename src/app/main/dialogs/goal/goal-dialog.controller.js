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

        if ( !vm.goal )
        {
            vm.goal = {
                title: '',
                type: 'Goal',
                start: new Date(),
                data: {
                    description: '',
                    type: 'Money',
                    money: {
                        budget: 0,
                        participants: 0,
                        distributionTable: []
                    }
                }
            };

            vm.TITLEKEY = 'GOAL.NEW_TITLE';
            vm.newItem = true;
        }

        // Methods
        vm.addNew = addNew;
        vm.saveItem = saveItem;
        vm.closeDialog = closeDialog;
        vm.toggleInArray = msUtils.toggleInArray;
        vm.exists = msUtils.exists;

        //////////

        /**
         * Add new step
         */
        function addNew() {

            timelineService.addNew(vm.goal);
            timelineService.save().then(function() {
                closeDialog();
            });
        }

        /**
         * Save step
         */
        function saveItem() {

            timelineService.saveItem(vm.goal);
            timelineService.save().then(function() {
                closeDialog();
            });
        }


        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide(vm.goal);
        }

    }
})();
