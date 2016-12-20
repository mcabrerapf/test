(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('themeGeneralViewController', themeGeneralViewController)
        .directive('themeGeneralView', themeGeneralViewDirective);

    /** @ngInject */
    function themeGeneralViewController($scope, $mdDialog, api)
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
    function themeGeneralViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'themeGeneralViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/general-view/general-view.html'
        };
    }
})();