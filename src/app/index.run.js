(function ()
{
    'use strict';

    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $stateParams, authorization, principal, DTDefaultOptions)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams)
        {
            $rootScope.loadingProgress = true;

            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (principal.isIdentityResolved()) authorization.authorize();
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });


        /**
         * DataTable default configuration
         */
        DTDefaultOptions.setDisplayLength(10);
    }
})();