(function ()
{
    'use strict';

    angular
        .module('app.common', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/common');

    }
})();
