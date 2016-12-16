(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.players', [])
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
                        templateUrl: 'app/main/pages/administration/players/players.html',
                        controller : 'PlayersController as vm'
                    }
                },
                data: {
                    roles: ['Admin', 'Manager']
                },
                resolve: {
                    players: function (apiResolver)
                    {
                        return apiResolver.resolve('users@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/administration/players');

        // Navigation
        msNavigationServiceProvider.saveItem('administration', {
            title : 'GESTIÓN DE CUSTOMERS/USUARIOS',
            group : true,
            weight: 1,
            translate: 'ADMINISTRATION.MENU.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('administration.players', {
            title    : 'Jugadores',
            icon     : 'icon-account-multiple',
            state    : 'app.players',
            translate: 'PLAYERS.MENU.TITLE',
            weight   : 1
        });
    }
})();