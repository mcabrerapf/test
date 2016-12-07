(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('timeLineViewController', timeLineViewController)
        .directive('timeLineView', timeLineViewDirective);

    /** @ngInject */
    function timeLineViewController($scope, $mdDialog, api)
    {
        var vm = this;
        vm.theme = $scope.theme;


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
    function timeLineViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'timeLineViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/time-line-view/time-line-view.html'
        };
    }
})();