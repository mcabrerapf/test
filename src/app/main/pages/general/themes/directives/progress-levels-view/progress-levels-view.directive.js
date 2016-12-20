(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('themeProgressLevelsViewController', themeProgressLevelsViewController)
        .directive('themeProgressLevelsView', themeProgressLevelsViewDirective);

    /** @ngInject */
    function themeProgressLevelsViewController($scope, $mdDialog, api)
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
    function themeProgressLevelsViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'themeProgressLevelsViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/progress-levels-view/progress-levels-view.html'
        };
    }
})();