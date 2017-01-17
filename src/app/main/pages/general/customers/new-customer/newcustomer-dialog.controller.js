(function () {
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('NewCustomerDialogController', NewCustomerDialogController);

    /** @ngInject */
    function NewCustomerDialogController($mdDialog, api) {
        var vm = this;

        // Data
        vm.isNew = true;
        vm.customer = {
            name: ''
        };

        api.users.find({}, function(users) {
            vm.users = users;
        });

        // Methods
        vm.addNewCustomer = addNewCustomer;
        vm.closeDialog = closeDialog;


        /**
         * Add new customer
         */
        function addNewCustomer() {
            api.customers.save(vm.customer, function (customer) {
                closeDialog(customer);
                $mdDialog.hide({customer: customer});
            }, function(error){
                alert(error.data.errmsg);
                console.error(error);
            });
        }


        /**
         * Close dialog
         */
        function closeDialog(returnValue) {
            $mdDialog.hide(returnValue);
        }

    }
})();