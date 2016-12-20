(function () {
    'use strict';

    angular
        .module('app.pages.general.teams')
        .controller('NewTeamDialogController', NewTeamDialogController);

    /** @ngInject */
    function NewTeamDialogController(customer, users, parentTeam, $mdDialog, api) {
        var vm = this;

        // Data
        vm.team = {
            customer: customer,
            name: '',
            admin: '',
            parent: parentTeam
        };

        vm.users = users

        vm.roles = ['admin', 'editor', 'public'];

        // Methods
        vm.addNewTeam = addNewTeam;
        vm.closeDialog = closeDialog;

        /**
         * Add new team
         */
        function addNewTeam() {
            api.teams.save(vm.team, function (team) {
                closeDialog(team);
            }, function (error) {
                console.error(error);
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