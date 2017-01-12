(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('PostDialogController', PostDialogController);

    /** @ngInject */
    function PostDialogController($mdDialog, Element, timelineService, msUtils) {

        var vm = this;

        // Data
        vm.TITLEKEY = 'POST.EDIT_TITLE';
        vm.post = angular.copy(Element);
        vm.newItem = false;

        if ( vm.post._id === undefined )
        {
            angular.extend(vm.post, {
                data: {
                    description: '',
                    body: ''
                }
            });

            vm.TITLEKEY = 'POST.NEW_TITLE';
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

            timelineService.addNew(vm.post).then(function(response) {
                closeDialog(response);
            });
        }

        /**
         * Save step
         */
        function saveItem() {

            timelineService.saveItem(vm.post).then(function(response) {
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
