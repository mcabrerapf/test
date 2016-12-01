(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.distributions', {
                url    : '/distributions',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/distributions/distributions.html',
                        controller : 'DistributionsController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    distributions: function (apiResolver)
                    {
                        return apiResolver.resolve('distributions@find');
                    }
                }
            })
            .state('app.distributions.detail', {
                url: '/:id',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/pages/general/distributions/distribution/distribution.html',
                        controller : 'DistributionController as vm'
                    }
                },
                data: {
                    roles: ['Admin']
                },
                resolve: {
                    distribution: function (apiResolver, $stateParams)
                    {
                        return apiResolver.resolve('distributions@findOne', {'id': $stateParams.id});
                    }
                }
            });


        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/general/distributions');

        // Navigation
        msNavigationServiceProvider.saveItem('general', {
            title : 'GENERAL',
            group : true,
            weight: 1,
            translate: 'GENERAL.SECTION_TITLE'
        });

        msNavigationServiceProvider.saveItem('general.distribution', {
            title    : 'Distribuciones',
            icon     : 'icon-chart-line',
            state    : 'app.distributions',
            translate: 'DISTRIBUTION.MENU.TITLE',
            weight   : 1
        });
    }
})();