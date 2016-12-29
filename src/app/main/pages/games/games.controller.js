(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('GamesController', GamesController);

    /** @ngInject */
    function GamesController(api, $mdDialog, $timeout, $filter, $state)
    {
        var vm = this;

        
        // Methods
        vm.createNew = createNew;
        vm.showGame = showGame;


        init();

        function init() {

            api.games.find(function(games) {

                vm.games = games;
                vm.filteredItems = games;

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
            });
        }

        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewGameDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/games/dialogs/new-game/newgame-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: true
            }).then(function(game) {

                if (game === undefined) return;
                vm.games.push(game);

                $state.go('app.games.detail', {'id': game._id});

            });
        }

        function showGame(event, game) {
            $state.go('app.games.detail', {'id': game._id});    }
        }
})();
