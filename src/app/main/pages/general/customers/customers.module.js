(function ()
{
    'use strict';

    angular
        .module('app.pages.general.customers', [
            'datatables'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.customers', {
                url    : '/customers',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/customers/customers.html',
                        controller : 'CustomersController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    customers: function (apiResolver) {
                        return apiResolver.resolve('customers@find');
                    },
                    users: function (apiResolver)
                    {
                        return apiResolver.resolve('users@find');
                    }
                }
            });

        console.log('app.pages.general.customers');

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/general/customers');

        // Navigation
        msNavigationServiceProvider.saveItem('general', {
            title : 'GENERAL',
            group : true,
            weight: 1,
            translate: 'GENERAL.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('general.customer', {
            title    : 'Clientes',
            icon     : 'icon-chart-line',
            state    : 'app.customers',
            translate: 'CUSTOMERS.MENU.TITLE',
            weight   : 1
        });
    }
})();