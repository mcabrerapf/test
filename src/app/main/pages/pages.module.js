(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login',
            'app.pages.games',
            'app.pages.general.themes',
            'app.pages.general.distributions',
            'app.pages.administration'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/pages');

    }
})();
