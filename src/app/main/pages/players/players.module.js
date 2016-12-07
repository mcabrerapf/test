(function ()
{
    'use strict';

    angular
        .module('app.pages.players', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.players', {
                url    : '/players',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/players/players.html',
                        controller : 'PlayersController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    players: function (apiResolver)
                    {
                        return apiResolver.resolve('users@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/players');

        // Navigation
        msNavigationServiceProvider.saveItem('players', {
            title : 'GESTIÓN DE JUGADORES',
            group : true,
            weight: 1,
            translate: 'PLAYERS.MENU.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('players.players', {
            title    : 'Jugadores',
            icon     : 'icon-account-multiple',
            state    : 'app.players',
            translate: 'PLAYERS.MENU.TITLE',
            weight   : 1
        });
    }
})();