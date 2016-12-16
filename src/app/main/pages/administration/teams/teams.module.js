(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.teams', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.teams', {
                url    : '/teams',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/administration/teams/teams.html',
                        controller : 'TeamsController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    teams: function (apiResolver)
                    {
                        return []; // apiResolver.resolve('teams@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/administration/teams');

        // Navigation
        msNavigationServiceProvider.saveItem('administration.teams', {
            title    : 'Equipos',
            icon     : 'icon-account-multiple',
            state    : 'app.teams',
            translate: 'TEAMS.MENU.TITLE',
            weight   : 1
        });
    }
})();