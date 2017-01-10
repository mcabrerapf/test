(function ()
{
    'use strict';

    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, fuseConfigProvider, $translateProvider)
    {
        // Enable debug logging
        $logProvider.debugEnabled(true);

        /*eslint-disable */

        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : true
        });

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });

        /*eslint-enable */

        // https://github.com/angular-translate/angular-translate/issues/1131
        // $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
        // $translateProvider.useSanitizeValueStrategy(null);
        /***
            NO soluciona el problema, así que evitamos caracteres especiales en el siguiente caso:
            $translate() en controller.js
        ***/

    }
})();