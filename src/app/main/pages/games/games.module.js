(function ()
{
    'use strict';

    angular
        .module('app.pages.games', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.games', {
                url    : '/games',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/games/games.html',
                        controller : 'GamesController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    games: function (apiResolver)
                    {
                        return apiResolver.resolve('games@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/games');

        // Navigation
        msNavigationServiceProvider.saveItem('games', {
            title : 'GESTIÓN DE PARTIDAS',
            group : true,
            weight: 1,
            translate: 'GAMES.MENU.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('games.games', {
            title    : 'Partidas',
            icon     : 'icon-gamepad-variant',
            state    : 'app.games',
            translate: 'GAMES.MENU.TITLE',
            weight   : 1
        });
    }
})();