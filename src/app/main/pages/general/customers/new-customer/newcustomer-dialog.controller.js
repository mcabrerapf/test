(function () {
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('NewCustomerDialogController', NewCustomerDialogController);

    /** @ngInject */
    function NewCustomerDialogController($mdDialog, api, customers, users, customer) {
        var vm = this;

        // Data
        vm.isNew = !customer;
        vm.customer = customer || {
            name: '',
            admin: ''
        };

        vm.users = users;

        // Methods
        vm.addNewCustomer = addNewCustomer;
        vm.updateCustomer = updateCustomer;
        vm.deleteCustomer = deleteCustomer;
        vm.closeDialog = closeDialog;

        /**
         * Add new customer
         */
        function addNewCustomer() {
            api.customers.save(vm.customer, function (customer) {
                $mdDialog.hide({customer: customer});
            }, function(error){
                $mdDialog.hide({customer: null, error: 'create customer error'});
            });
        }

        function updateCustomer() {
            api.customers.update(vm.customer, function(customer) {
                $mdDialog.hide({customer: customer});
            }, function(error) {
                $mdDialog.hide({customer: null, error: 'update customer error'});
            })
        }
        function deleteCustomer() {
            api.customers.remove({id: vm.customer._id}, function(customer) {
                $mdDialog.hide({customer: customer});
            }, function(error) {
                $mdDialog.hide({customer: null, error: 'delete customer error'});
            })
        }


        /**
         * Close dialog
         */
        function closeDialog(returnValue) {
            $mdDialog.hide(returnValue);
        }

    }
})();