(function () {
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('CustomersController', CustomersController);

    /** @ngInject */
    function CustomersController(customers, users, $q, api, $mdDialog, $mdToast, $filter, $timeout) {
        var vm = this;

        vm.users = users;
        vm.customers = [];

        vm.dtOptions = vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            responsive: true
        };

        loadCustomers()

        // Methods
        // vm.createNew = createNew;
        vm.editCustomer = editCustomer


        //////////
        // function createNew(event) {
        //
        //     $mdDialog.show({
        //         controller: 'NewCustomerDialogController',
        //         controllerAs: 'vm',
        //         templateUrl: 'app/main/pages/general/customers/new-customer/newcustomer-dialog.html',
        //         parent: angular.element(document.body),
        //         targetEvent: event,
        //         clickOusideToClose: false,
        //         locals: {
        //             customers: vm.customers,
        //             users: vm.users,
        //             customer: null
        //         }
        //     }).then(function (customer, error) {
        //         console.log(customer, error)
        //         loadCustomers()
        //     });
        // }

        function editCustomer(event, customer) {
            $mdDialog.show({
                controller: 'NewCustomerDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/pages/general/customers/new-customer/newcustomer-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOusideToClose: false,
                locals: {
                    customers: vm.customers,
                    users: vm.users,
                    customer: customer
                }
            }).then(function (data) {
                console.log(data);
                if(data.error) {
                    console.log(data.error);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.error)
                            .position('top right')
                    );
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Operación realizada correctamente')
                            .position('top right')
                    );
                }
                loadCustomers()
            });
        }

        function loadCustomers() {
            api.customers.find(function (customers) {
                customers.forEach(function (customer) {
                    customer.admin = vm.users.find(function (user) {
                        return user._id === customer.admin;
                    });
                });
                vm.customers = customers;
            }, function (error) {
                vm.customers = [];
                return error;
            });
        }


    }
})();
