(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions')
        .controller('NewDistributionDialogController', NewDistributionDialogController);

    /** @ngInject */
    function NewDistributionDialogController($scope, $mdDialog, api, $translate)
    {
        var vm = this;

        // Data
        vm.distribution = {
            name: '',
            description: '',
            type:   'Points',
            participants: 10,
            formula: '',
            distributionTable: []
        };

        // Methods
        vm.addNewDistribution = addNewDistribution;
        vm.closeDialog = closeDialog;



        /**
         * Add new distribution
         */
        function addNewDistribution()
        {
            api.distributions.save(vm.distribution,
                function(newDistribution) {
                    closeDialog(newDistribution);
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.error(error);
                });
        }


        /**
         * Close dialog
         */
        function closeDialog(returnValue)
        {
            $mdDialog.hide(returnValue);
        }

    }
})();