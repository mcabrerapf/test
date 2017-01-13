(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('UsersController', UsersController);

    /** @ngInject */
    function UsersController(users, customers, $mdToast, api, $mdDialog, $state, $translate) {
        var vm = this;

        vm.users = []
        vm.customers = customers

        vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            responsive: true
        };

        loadUsers()

        // Methods
        vm.editUser = editUser;
        vm.importUsers = importUsers;


        //////////
        function editUser(event, user) {

            $mdDialog.show({
                controller: 'NewUserDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/pages/general/users/new-user/newuser-dialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOusideToClose: true,
                locals: {
                    customers: vm.customers,
                    users: vm.users,
                    user: user
                }
            }).then(function (data) {
                if(data) {
                    if (data.error) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent(data.error)
                                .position('top right')
                        );
                        loadUsers()
                    } else if(data.action === 'delete'){
                        confirmDelete(event, data.user);
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Operación realizada correctamente')
                                .position('top right')
                        );
                        loadUsers()
                    }
                }
            });
        }

        function importUsers() {
            $state.go('app.users.import')
        }

        function loadUsers() {
            api.users.find(function (users) {
                users.forEach(function (user) {
                    user.gridCustomer = vm.customers.find(function (customer) {
                        return customer._id === user.customer;
                    }) || {};
                });
                vm.users = users;
            }, function (error) {
                vm.users = [];
                return error;
            });
        }

        function confirmDelete (event, user) {
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
                    .targetEvent(event)
                    .ok(translationValues['FORMS.OK'])
                    .cancel(translationValues['FORMS.CANCEL']);

                $mdDialog.show(confirm).then(function (data) {
                    if(data){
                        api.users.remove({id: user._id}, function (user) {
                            loadUsers();
                        }, function (error) {
                            loadUsers();
                        });
                    } else {
                        editUser(event, user)
                    }
                });
            });
        }
    }

})();
