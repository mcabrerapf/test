(function ()
{
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('CustomerController', CustomerController);

    /** @ngInject */
    function CustomerController($scope, $state, customer, api, $translate, $mdDialog, $timeout)
    {
        var vm = this;

        // Data
        vm.customer = customer;

        vm.flipped = {
            definition: false,
            customer: false
        };
        
        // Methods
        vm.gotoList = gotoList;
        vm.saveCustomer = saveCustomer;
        vm.deleteCustomerConfirm = deleteCustomerConfirm;
        vm.editDefinition = editDefinition;
        vm.saveDefinition = saveDefinition;
        vm.editCustomerParams = editCustomerParams;
        vm.saveCustomerParams = saveCustomerParams;


        /////////////////

        /**
         * Initialize
         */
        function init()
        {
        }


        //////////



        /**
         * Edit customer
         */
        function editCustomerParams() {

            vm.flipped.definition = false;
            vm.customerCopy = angular.copy(vm.customer);
            vm.flipped.customer = true;
        }

        /** 
         * Save customer 
         * */
        function saveCustomerParams() {

            vm.customer = angular.extend(vm.customer, vm.customerCopy);
            vm.saveCustomer();
        }
        
        /**
         * Edit definition
         */
        function editDefinition() {

            vm.flipped.customer = false;
            vm.customerCopy = angular.copy(vm.customer);
            vm.flipped.definition = true;
        }

        /** 
         * Save definition 
         * */
        function saveDefinition() {

            vm.customer = angular.extend(vm.customer, vm.customerCopy);
            vm.saveCustomer();
        }

        /**
         * Save customer
         */
        function saveCustomer()
        {
            var id = vm.customer._id;

            api.customers.update({id: id}, vm.customer,
                function(updatedCustomer) {

                    angular.forEach(vm.flipped, function(value, key) {
                        vm.flipped[key] = false;
                    });
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.error(error);
                });
        }

        /**
         * Delete Customer Confirm Dialog
         */
        function deleteCustomerConfirm(ev)
        {
            $translate([
                'FORMS.DELETECONFIRMATION.TITLE',
                'FORMS.DELETECONFIRMATION.DETAIL',
                'FORMS.DELETECONFIRMATION.ARIAL',
                'FORMS.CANCEL',
                'FORMS.OK']).then(function (translationValues) {

                var confirm = $mdDialog.confirm()
                    .title(translationValues['FORMS.DELETECONFIRMATION.TITLE'])
                    .htmlContent(translationValues['FORMS.DELETECONFIRMATION.DETAIL'])
                    .ariaLabel(translationValues['FORMS.DELETECONFIRMATION.ARIAL'])
                    .targetEvent(ev)
                    .ok(translationValues['FORMS.OK'])
                    .cancel(translationValues['FORMS.CANCEL']);

                $mdDialog.show(confirm).then(function ()
                {

                    api.customers.delete({id: vm.customer._id}, 
                        function() {

                            vm.gotoList();

                        }, function(error) {
                            alert(error.data.errmsg);
                            console.error(error);
                        });
                });

            });
        }


        /**
         * Go to list page
         */
        function gotoList()
        {
            $state.go('app.customers');
        }

    }
})();