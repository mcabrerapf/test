(function ()
{
    'use strict';

    angular
        .module('app.pages.general.customers')
        .controller('CustomersController', CustomersController);

    /** @ngInject */
    function CustomersController(users, $scope, api, $mdDialog, $state, $filter, $timeout)
    {
        var vm = this;

        vm.users = users;

        var datasource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    api.customers.find(function (customers) {
                        options.success(customers);
                    }, function (error) {
                        options.error(error);
                    });
                },
                create: function(options) {

                },
                parameterMap: function (options, operation) {
                    if (operation !== 'read' && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: '_id',
                    fields: {
                        name: {editable: true},
                        admin: {editable: true}
                    }
                }
            }
        })

        vm.gridOptions = {
            dataSource: datasource,
            theme: 'common',
            scrollable: true,
            sortable: true,
            filterable: true,
            navigatable: true,
            selectable: false, // 'single row',
            editable: 'inline',
            pageable: {
                input: true,
                numeric: false
            },
            save: function (data) {
                data.model.$update({id: data.model._id}, function () {
                    $('#customersGrid').data('kendoGrid').dataSource.read();
                    $('#customersGrid').data('kendoGrid').refresh();
                });
            },
            remove: function (data) {
                console.log(data.model)
                data.model.$delete({id: data.model._id}, function () {
                    $('#customersGrid').data('kendoGrid').dataSource.read();
                    $('#customersGrid').data('kendoGrid').refresh();
                });
            },
            columns: [
                {
                    field: 'name',
                    // title: translateValues['USERS.NAME'],
                    filterable: {multi: true, search: true}
                },
                {
                    field: 'admin',
                    // title: translateValues['USERS.EMAIL'],
                    filterable: {multi: true, search: true},
                    editor: function(container, options) {
                        var input = $('<input/>');
                        input.attr('name', options.field);
                        input.appendTo(container);
                        input.kendoAutoComplete({
                            dataTextField: 'userName',
                            datavaluefield: '_id',
                            dataSource: vm.users
                        });
                    }
                },
                {
                    command: ['edit', 'destroy'],
                    title: '&nbsp;',
                    width: '300px'
                }
            ]
        };

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
            });
        }


    }
})();
