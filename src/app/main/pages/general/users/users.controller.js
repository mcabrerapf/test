(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('UsersController', UsersController);

    /** @ngInject */
    function UsersController(users, customers, translateValues, api, $mdDialog, $state, $filter, $timeout) {
        var vm = this;

        vm.users = users
        vm.customers = customers

        var datasource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    api.users.find(function (users) {
                        options.success(users);
                    }, function (error) {
                        options.error(error);
                    });
                },
                create: function (options) {

                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
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
                        userName: {editable: true},
                        email: {editable: true},
                        role: {editable: true},
                        customer: {editable: true},
                        active: {editable: true},
                        code: {editable: false}
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
                    $('#usersGrid').data('kendoGrid').dataSource.read();
                    $('#usersGrid').data('kendoGrid').refresh();
                });
            },
            remove: function (data) {
                console.log(data.model)
                data.model.$delete({id: data.model._id}, function () {
                    $('#usersGrid').data('kendoGrid').dataSource.read();
                    $('#usersGrid').data('kendoGrid').refresh();
                });
            },
            columns: [
                {
                    field: "userName",
                    title: translateValues['USERS.NAME'],
                    filterable: {multi: true, search: true}
                },
                {
                    field: "email",
                    title: translateValues['USERS.EMAIL'],
                    filterable: {multi: true, search: true}
                },
                {
                    field: "role",
                    title: translateValues['USERS.ROLE'],
                    filterable: {multi: true, search: true},
                    editor: roleDropDownEditor,
                    template: function (dataItem) {
                        return '<span ng-repeat="role in dataItem.role"> {{role}} </span>';
                    }
                },
                {
                    field: "customer",
                    // title: translateValues['USERS.ROLE'],
                    filterable: {multi: true, search: true},
                    editor: customerDropDownEditor,
                    template: function (dataItem) {
                        return '<span ng-repeat="customer in vm.customers | filter: dataItem.customer" ng-if="dataItem.customer"> {{customer.name}} </span>';
                    }
                },
                {
                    field: "active",
                    // title: translateValues['USERS.ROLE'],
                    filterable: {multi: true, search: true},
                    editor: activeSwitchEditor,
                },
                {
                    field: "code",
                    // title: translateValues['USERS.ROLE'],
                    filterable: {multi: true, search: true},
                    // editor: customerDropDownEditor,
                    template: function (dataItem) {
                        return '<div ng-repeat="code in dataItem.code" ng-if="dataItem.code.length">' +
                            '<span> {{code.sellerCode}} </span>' +
                            '<span> - </span>' +
                            '<span> {{code.teamLeader}} </span>' +
                            '</div>';
                    }
                },
                {
                    command: ["edit", "destroy"],
                    title: "&nbsp;",
                    width: "300px"
                }
            ]
        };

        // Methods
        vm.createNew = createNew;
        vm.editUser = editUser;
        vm.importUsers = importUsers;


        //////////
        function createNew(event) {

            $mdDialog.show({
                controller: 'NewUserDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/pages/general/users/new-user/newuser-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOusideToClose: false
            });
        }

        function editUser(event) {
            event.preventDefault();

            var dataItem = this.dataItem($(event.currentTarget).closest("tr"));
            console.log(dataItem);
        }

        function importUsers() {
            $state.go('app.users.import')
        }

        function roleDropDownEditor(container, options) {
            $('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoMultiSelect({
                    autoBind: false,
                    dataSource: ['player', 'manager', 'admin']
                });
        }

        function customerDropDownEditor(container, options) {
            $('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    autoBind: true,
                    dataTextField: "name",
                    dataValueField: "_id",
                    dataSource: vm.customers
                });
        }

        function activeSwitchEditor(container, options) {
            $('<input name="' + options.field + '"/>')
                .appendTo(container)
                .kendoMobileSwitch({
                    onLabel: "YES",
                    offLabel: "NO"
                });

        }
    }

})();
