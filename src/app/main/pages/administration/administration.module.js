(function ()
{
    'use strict';

    angular
        .module('app.pages.administration', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.administration', {
                url    : '/administration',
                abstract: true,
                data: {
                    roles: ['Admin', 'Manager']
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/administration');

        // Navigation
        msNavigationServiceProvider.saveItem('administration', {
            title : 'GESTIÓN DE CUSTOMERS/USUARIOS',
            group : true,
            weight: 1,
            translate: 'PLAYERS.MENU.SECTION_TITLE'
        });
    }
})();