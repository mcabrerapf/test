(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.users', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.users', {
                url    : '/users',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/administration/users/users.html',
                        controller : 'UsersController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    users: function (apiResolver)
                    {
                        return apiResolver.resolve('users@find');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/administration/users');

        // Navigation
        msNavigationServiceProvider.saveItem('administration.users', {
            title    : 'Jugadores',
            icon     : 'icon-account-multiple',
            state    : 'app.users',
            translate: 'USERS.MENU.TITLE',
            weight   : 1
        });
    }
})();