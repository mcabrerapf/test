(function ()
{
    'use strict';

    angular
        .module('app.pages.administration')
        .controller('PlayersController', PlayersController);

    /** @ngInject */
    function PlayersController(players, api, $mdDialog, $timeout, $filter)
    {
        var vm = this;

        vm.players = players;
        vm.filteredItems = players;
        
        console.log(players);

        // Methods
        vm.createNew = createNew;


        init();

        function init() {
            var searchBox = angular.element('body').find('#search');

            if ( searchBox.length > 0 )
            {
                searchBox.on('keyup', function (event)
                {
                    $timeout(function() {
                        if (event.target.value === '') {
                            vm.filteredItems = vm.players;
                        } else {
                            vm.filteredItems = $filter('filter')(vm.players, {"name": event.target.value});
                        }
                    });
                });
            }
        }

        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewGameDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/players/new-player/newplayer-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: true
            });
        }
    }
})();
