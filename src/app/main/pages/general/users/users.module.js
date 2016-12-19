(function () {
    'use strict';

    angular
        .module('app.pages.general.users', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.users', {
                url: '/users',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/users/users.html',
                        controller: 'UsersController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    users: function (apiResolver) {
                        return apiResolver.resolve('users@find');
                    },
                    customers: function (apiResolver) {
                        return apiResolver.resolve('customers@find');
                    },
                    translateValues: function ($translate) {
                        return $translate([
                            'USERS.NAME',
                            'USERS.EMAIL',
                            'USERS.ROLE'
                        ]);
                    }
                }
            })
            .state('app.users.import', {
                url: '/import',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/users/import-users/import-users.html',
                        controller: 'ImportUsersController as vm'
                    }
                },
                resolve: {
                    customers: function (apiResolver) {
                        return apiResolver.resolve('customers@find');
                    }
                },
                data: {
                    roles: ['Admin']
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/general/users');

        // Navigation
        msNavigationServiceProvider.saveItem('general', {
            title: 'GENERAL',
            group: true,
            weight: 1,
            translate: 'GENERAL.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('general.user', {
            title: 'Distribuciones',
            icon: 'icon-chart-line',
            state: 'app.users',
            translate: 'USERS.MENU.TITLE',
            weight: 1
        });
    }
})();