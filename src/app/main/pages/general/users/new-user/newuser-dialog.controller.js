(function () {
    'use strict';

    angular
        .module('app.pages.general.users')
        .controller('NewUserDialogController', NewUserDialogController);

    /** @ngInject */
    function NewUserDialogController(customers, users, user, $mdDialog, api, $translate) {
        var vm = this;

        // Data
        vm.isNew = !user;
        vm.user = user || {
                email: '',
                password: '',
                userName: '',
                active: false,
                role: '',
                customer: '',
                mentor: ''
            };

        vm.customers = customers;
        vm.users = users;
        vm.roles = ['admin', 'manager', 'mentor', 'player'];

        // Methods
        vm.addNewUser = addNewUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.closeDialog = closeDialog;

        /**
         * Add new customer
         */
        function addNewUser() {
            api.users.save(vm.user, function (user) {
                $mdDialog.hide({user: user});
            }, function (error) {
                $mdDialog.hide({user: null, error: 'create user error'});
            });
        }

        function updateUser() {
            api.users.update(vm.user, function (user) {
                $mdDialog.hide({user: user});
            }, function (error) {
                $mdDialog.hide({user: null, error: 'update user error'});
            })
        }

        function deleteUser($event) {
            $mdDialog.hide({user: vm.user, action: 'delete'});
            // $translate([
            //     'FORMS.DELETECONFIRMATION.TITLE',
            //     'FORMS.DELETECONFIRMATION.DETAIL',
            //     'FORMS.DELETECONFIRMATION.ARIAL',
            //     'FORMS.CANCEL',
            //     'FORMS.OK']).then(function (translationValues) {
            //
            //     var confirm = $mdDialog.confirm()
            //         .title(translationValues['FORMS.DELETECONFIRMATION.TITLE'])
            //         .htmlContent(translationValues['FORMS.DELETECONFIRMATION.DETAIL'])
            //         .ariaLabel(translationValues['FORMS.DELETECONFIRMATION.ARIAL'])
            //         .targetEvent($event)
            //         .ok(translationValues['FORMS.OK'])
            //         .cancel(translationValues['FORMS.CANCEL']);
            //
            //     $mdDialog.show(confirm).then(function (data) {
            //         console.log(data);
            //         api.users.remove({id: vm.user._id}, function (user) {
            //             $mdDialog.hide({user: user});
            //         }, function (error) {
            //             $mdDialog.hide({user: null, error: 'delete customer error'});
            //         });
            //     });
            // });
        }


        /**
         * Close dialog
         */
        function closeDialog(returnValue) {
            $mdDialog.hide(returnValue);
        }

    }
})();