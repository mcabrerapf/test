(function ()
{
    'use strict';

    angular
        .module('app.dialogs', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/dialogs');

    }
})();
