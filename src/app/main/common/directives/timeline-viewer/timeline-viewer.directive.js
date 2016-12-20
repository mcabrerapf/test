(function ()
{
    'use strict';

    angular
        .module('app.common')
        .controller('timelineViewerController', timelineViewerController)
        .directive('timelineViewer', timelineViewerDirective);

    /** @ngInject */
    function timelineViewerController($scope, $translate, $mdDialog, api)
    {
        var vm = this;
        vm.dataService = $scope.dataService;

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
    function timelineViewerDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                dataService: '=dataService'
            },
            controller: 'timelineViewerController',
            controllerAs: 'vm',
            templateUrl: 'app/main/common/directives/timeline-viewer/timeline-viewer.html'
        };
    }
})();