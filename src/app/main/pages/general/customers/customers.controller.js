(function () {
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('CustomersController', CustomersController);

    /** @ngInject */
    function CustomersController(translateValues, api, $mdDialog, $state) {

        var vm = this;

        api.customers.find(function(customers) {

            vm.customers = customers;

            vm.gridOptions = {
                dataSource: {
                    data: vm.customers,
                    pageSize: 20
                },
                scrollable: true,
                sortable: true,
                filterable: true,
                navigatable: true,
                navigate: function(e) {
                    if (e.element[0].tagName === 'TH') return;
                    var id = this.dataItem(e.element.parent())._id;
                    $state.go('app.customers.detail', {'id': id});
                },
                selectable: false, // 'single row',
                pageable: {
                    input: true,
                    numeric: false
                },
                columns: [
                    {   field: "name", title: translateValues['CUSTOMERS.GRID.NAME'] },
                    {   field: "admin.userName", title: translateValues['CUSTOMERS.GRID.ADMIN'] }
                ],
                height: '100%'
            };
        });


        // Methods
        vm.createNew = createNew;


        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewCustomerDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/general/customers/new-customer/newcustomer-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: false
            }).then(function(customer) {

                if (customer === undefined) return;
                vm.customers.push(customer);

                $state.go('app.customers.detail', {'id': customer._id});

            });
        }


    }
})();
