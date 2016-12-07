(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('generalViewController', generalViewController)
        .directive('generalView', generalViewDirective);

    /** @ngInject */
    function generalViewController($scope, $mdDialog, api)
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
    function generalViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'generalViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/general-view/general-view.html'
        };
    }
})();