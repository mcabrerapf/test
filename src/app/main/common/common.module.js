(function ()
{
    'use strict';

    angular
        .module('app.common', [
            'app.common.timeline-viewer'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/common');

    }
})();
