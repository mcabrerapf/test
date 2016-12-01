(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemesController', ThemesController);

    /** @ngInject */
    function ThemesController(themes, api, $mdDialog, $state, $filter, $timeout)
    {
        var vm = this;

        vm.themes = themes;
        vm.filteredItems = themes;
        
        // Methods
        vm.createNew = createNew;
        vm.showTheme = showTheme;

        init();

        function init() {

            var searchBox = angular.element('body').find('#search');

            if ( searchBox.length > 0 )
            {
                searchBox.on('keyup', function (event)
                {
                    $timeout(function() {
                        if (event.target.value === '') {
                            vm.filteredItems = vm.themes;
                        } else {
                            vm.filteredItems = $filter('filter')(vm.themes, {"name": event.target.value});
                        }
                    });
                });
            }
        }



        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewThemeDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/general/themes/new-theme/newtheme-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: false
            }).then(function(theme) {

                if (theme === undefined) return;
                vm.themes.push(theme);

                $state.go('app.themes.detail', {'id': theme._id});

            });
        }


        //////////
        function showTheme(event, theme) {

            $state.go('app.themes.detail', {'id': theme._id});
        }
    }
})();
