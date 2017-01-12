(function ()
{
    'use strict';

    angular
        .module('app.common.timeline-viewer', [
            'ngVis'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $translatePartialLoaderProvider)
    {

        $translatePartialLoaderProvider.addPart('app/main/common/directives/timeline-viewer');

    }
})();
