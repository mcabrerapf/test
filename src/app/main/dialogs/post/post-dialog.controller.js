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

        if ( !vm.post )
        {
            vm.post = {
                title: '',
                type: 'Post',
                start: new Date(),
                data: {
                    description: '',
                    body: ''
                }
            };

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

            timelineService.addNew(vm.post);
            timelineService.save().then(function() {
                closeDialog();
            });
        }

        /**
         * Save step
         */
        function saveItem() {

            timelineService.saveItem(vm.post);
            timelineService.save().then(function() {
                closeDialog();
            });
        }


        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide(vm.post);
        }

    }
})();
