(function ()
{
    'use strict';

    angular
        .module('app.pages.general.teams', [])
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
                        templateUrl: 'app/main/pages/general/teams/teams.html',
                        controller : 'TeamsController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    users: function (apiResolver)
                    {
                        return apiResolver.resolve('users@find');
                    },
                    customers: function (apiResolver)
                    {
                        return apiResolver.resolve('customers@find');
                    }
                }
            });

        console.log('app.pages.general.teams');

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/general/teams');

        // Navigation
        msNavigationServiceProvider.saveItem('general', {
            title : 'GENERAL',
            group : true,
            weight: 1,
            translate: 'GENERAL.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('general.team', {
            title    : 'Clientes',
            icon     : 'icon-chart-line',
            state    : 'app.teams',
            translate: 'TEAMS.MENU.TITLE',
            weight   : 1
        });
    }
})();