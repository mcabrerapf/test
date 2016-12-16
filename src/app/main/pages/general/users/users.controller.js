(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('UsersController', UsersController);

    /** @ngInject */
    function UsersController(users, translateValues, api, $mdDialog, $state, $filter, $timeout) {
        var vm = this;

        vm.users = users.map(function(user){
            delete user.data;
            return user;
        });

        var datasource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    api.users.find(function (users) {
                        options.success(users);
                    }, function (error) {
                        options.error(error);
                    });
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
                    id: "ProductID",
                    fields: {
                        userName: {editable: true},
                        email: {editable: true},
                        role: {editable: true},
                    }
                }
            }
        })

        vm.gridOptions = {
            dataSource: vm.users,
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
            save: function(data) {
                data.model.$update({id: data.model._id}, function(user){
                    api.users.find(function(users){
                        vm.users = users;
                        $('#usersGrid').data('kendoGrid').dataSource.read();
                        $('#usersGrid').data('kendoGrid').refresh();
                    });
                });
            },
            remove: function(data) {
                data.model.$delete({id: data.model._id}, function(user){
                    api.users.find(function(users){
                        vm.users = users;
                        $('#usersGrid').data('kendoGrid').dataSource.read();
                        $('#usersGrid').data('kendoGrid').refresh();
                    });
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
                    filterable: {multi: true, search: true}
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

    }
})();
