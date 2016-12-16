(function () {
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('NewCustomerDialogController', NewCustomerDialogController);

    /** @ngInject */
    function NewCustomerDialogController($mdDialog, api) {
        var vm = this;

        // Data
        vm.customer = {
            name: '',
            admin: ''
        };

        // Methods
        vm.addNewCustomer = addNewCustomer;
        vm.closeDialog = closeDialog;

        loadUsers();


        function loadUsers(){
            api.users.find(function(users){
                vm.users = users;
            });
        }

        /**
         * Add new customer
         */
        function addNewCustomer() {
            api.customers.save(vm.customer, function (customer) {
                console.log(customer);
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