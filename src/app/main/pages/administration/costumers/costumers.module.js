(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.costumers', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.costumers', {
                url    : '/costumers',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/administration/costumers/costumers.html',
                        controller : 'CostumersController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    costumers: function (apiResolver)
                    {
                        return []; // apiResolver.resolve('costumers@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/administration/costumers');

        // Navigation
        msNavigationServiceProvider.saveItem('administration', {
            title : 'GESTIÓN DE CUSTOMERS/USUARIOS',
            group : true,
            weight: 1,
            translate: 'ADMINISTRATION.MENU.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('administration.costumers', {
            title    : 'Jugadores',
            icon     : 'icon-account-multiple',
            state    : 'app.costumers',
            translate: 'COSTUMERS.MENU.TITLE',
            weight   : 1
        });
    }
})();