(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.players', ['app.pages.administration'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.administration.players', {
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


        msNavigationServiceProvider.saveItem('administration.players', {
            title    : 'Jugadores',
            icon     : 'icon-account-multiple',
            state    : 'app.administration.players',
            translate: 'PLAYERS.MENU.TITLE',
            weight   : 1
        });
    }
})();