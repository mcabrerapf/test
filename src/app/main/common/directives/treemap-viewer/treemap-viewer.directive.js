(function ()
{
    'use strict';

    angular
        .module('app.common')
        .controller('treemapViewerController', treemapViewerController)
        .directive('treemapViewer', treemapViewerDirective);

    /** @ngInject */
    function treemapViewerController($scope, $translate, $mdDialog, gameService)
    {
        var vm = this;
        vm.data = gameService.budgetDistribution;

        // Methods

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
        }

        //////////


    }
    
    /** @ngInject */
    function treemapViewerDirective()
    {
        return {
            restrict: 'E',
            scope: true,
            controller: 'treemapViewerController',
            controllerAs: 'vm',
            templateUrl: 'app/main/common/directives/treemap-viewer/treemap-viewer.html'
        };
    }
})();