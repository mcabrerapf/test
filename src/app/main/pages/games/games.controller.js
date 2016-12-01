(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('GamesController', GamesController);

    /** @ngInject */
    function GamesController(games, api, $mdDialog, $timeout, $filter)
    {
        var vm = this;

        vm.games = games;
        vm.filteredItems = games;
        
        console.log(games);

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
                            vm.filteredItems = vm.games;
                        } else {
                            vm.filteredItems = $filter('filter')(vm.games, {"name": event.target.value});
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
                templateUrl:        'app/main/pages/games/new-game/newgame-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: true
            });
        }
    }
})();
