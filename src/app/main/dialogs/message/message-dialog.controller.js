(function ()
{
    'use strict';

    angular
        .module('app.dialogs')
        .controller('MessageDialogController', MessageDialogController);

    /** @ngInject */
    function MessageDialogController($mdDialog, Element, timelineService, msUtils) {

        var vm = this;

        // Data
        vm.TITLEKEY = 'MESSAGE.EDIT_TITLE';
        vm.message = angular.copy(Element);
        vm.newItem = false;

        if ( !vm.message )
        {
            vm.message = {
                title: '',
                type: 'Message',
                start: new Date(),
                data: {
                    to: '',
                    subject: '',
                    body: ''
                }
            };

            vm.TITLEKEY = 'MESSAGE.NEW_TITLE';
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

            vm.message.title = vm.message.data.subject;
            timelineService.addNew(vm.message);
            timelineService.save().then(function() {
                closeDialog();
            });
        }

        /**
         * Save step
         */
        function saveItem() {

            vm.message.title = vm.message.data.subject;
            timelineService.saveItem(vm.message);
            timelineService.save().then(function() {
                closeDialog();
            });
        }


        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide(vm.message);
        }

    }
})();
