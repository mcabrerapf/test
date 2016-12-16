(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('NewUserDialogController', NewUserDialogController);

    /** @ngInject */
    function NewUserDialogController($mdDialog, api) {
        var vm = this;

        // Data
        vm.user = {
            email: '',
            password: '',
            userName: '',
            active: false,
            role: [],
            customer: '',
            mentor: ''
        };

        vm.roles = ['admin', 'editor', 'public'];

        // Methods
        vm.addNewUser = addNewUser;
        vm.closeDialog = closeDialog;

        loadCustomers();


        function loadCustomers(){
            api.customers.find(function(customers){
                vm.customers = customers;
            });
        }

        /**
         * Add new user
         */
        function addNewUser() {
            api.users.save(vm.user, function (response) {
                console.log(response);
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