(function ()
{
    'use strict';

    angular
        .module('app.pages.general.customers', [])
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
                    translateValues: function($translate) {
                        return $translate([
                            'CUSTOMERS.GRID.NAME',
                            'CUSTOMERS.GRID.ADMIN'
                        ]);
                    }
                }
            })
            .state('app.customers.detail', {
                url: '/:id',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/customers/customer/customer.html',
                        controller : 'CustomerController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    customer: function (apiResolver, $stateParams)
                    {
                        return apiResolver.resolve('customers@findOne', {'id': $stateParams.id});
                    }
                }
            });

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
            icon     : 'icon-factory',
            state    : 'app.customers',
            translate: 'CUSTOMERS.MENU.TITLE',
            weight   : 1
        });
    }
})();