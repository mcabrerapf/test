(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('progressLevelsViewController', progressLevelsViewController)
        .directive('progressLevelsView', progressLevelsViewDirective);

    /** @ngInject */
    function progressLevelsViewController($scope, $mdDialog, api)
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
    function progressLevelsViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'progressLevelsViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/progress-levels-view/progress-levels-view.html'
        };
    }
})();