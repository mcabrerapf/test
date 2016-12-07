(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.themes', {
                url    : '/themes',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/themes/themes.html',
                        controller : 'ThemesController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                }
            })
            .state('app.themes.detail', {
                url: '/:id',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/themes/theme/theme.html',
                        controller : 'ThemeController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    theme: function (apiResolver, $stateParams)
                    {
                        return apiResolver.resolve('themes@findOne', {'id': $stateParams.id});
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/general/themes');

        // Navigation
        msNavigationServiceProvider.saveItem('general', {
            title : 'GENERAL',
            group : true,
            weight: 1,
            translate: 'GENERAL.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('general.themes', {
            title    : 'Partidas',
            icon     : 'icon-theme-light-dark',
            state    : 'app.themes',
            translate: 'THEMES.MENU.TITLE',
            weight   : 1
        });
    }
})();