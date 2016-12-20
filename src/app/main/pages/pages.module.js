(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login',
            'app.pages.games',
            'app.pages.general.themes',
            'app.pages.general.distributions',
            'app.pages.general.users',
            'app.pages.general.customers',
            'app.pages.general.teams'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/pages');

    }
})();
