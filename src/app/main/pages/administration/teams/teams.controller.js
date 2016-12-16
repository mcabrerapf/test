(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.teams')
        .controller('TeamsController', TeamsController);

    /** @ngInject */
    function TeamsController(teams, api, $mdDialog, $timeout, $filter)
    {
        var vm = this;

        // vm.teams = teams;
        // vm.filteredItems = teams;
        //
        // Methods
        vm.createNew = createNew;
        //
        //
        // init();
        //
        // function init() {
        //     var searchBox = angular.element('body').find('#search');
        //
        //     if ( searchBox.length > 0 )
        //     {
        //         searchBox.on('keyup', function (event)
        //         {
        //             $timeout(function() {
        //                 if (event.target.value === '') {
        //                     vm.filteredItems = vm.teams;
        //                 } else {
        //                     vm.filteredItems = $filter('filter')(vm.teams, {"name": event.target.value});
        //                 }
        //             });
        //         });
        //     }
        // }

        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewTeamDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/teams/new-team/newteam-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: true
            });
        }
    }
})();
