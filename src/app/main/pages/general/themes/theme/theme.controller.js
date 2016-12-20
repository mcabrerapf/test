(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemeController', ThemeController);

    /** @ngInject */
    function ThemeController($q, $state, $stateParams, $mdDialog, $translate, themeService)
    {
        var vm = this;

        // Data
        vm.themeService = themeService;
        vm.theme = themeService.theme;
        vm.themeCopy = angular.copy(vm.theme);


        // Methods
        vm.gotoThemes = gotoThemes;
        vm.deleteConfirm = deleteConfirm;
        vm.updateThemeName = updateTheme;



        /**
         * Update theme (name)
         */
        function updateTheme(newName) {

            return themeService.rename(newName).then(function() {
                vm.themeCopy.name = newName;
                return true;
            }, function(error) {
                vm.themeCopy.name = vm.theme.name;
                return false;
            });
        }


        /**
         * Delete Confirm Dialog
         */
        function deleteConfirm(ev)
        {
            $translate([
                'FORMS.DELETECONFIRMATION.TITLE',
                'FORMS.DELETECONFIRMATION.DETAIL',
                'FORMS.DELETECONFIRMATION.ARIAL',
                'FORMS.CANCEL',
                'FORMS.OK']).then(function (translationValues) {

                var confirm = $mdDialog.confirm()
                    .title(translationValues['FORMS.DELETECONFIRMATION.TITLE'])
                    .htmlContent(translationValues['FORMS.DELETECONFIRMATION.DETAIL'])
                    .ariaLabel(translationValues['FORMS.DELETECONFIRMATION.ARIAL'])
                    .targetEvent(ev)
                    .ok(translationValues['FORMS.OK'])
                    .cancel(translationValues['FORMS.CANCEL']);

                $mdDialog.show(confirm).then(function ()
                {
                    themeService.remove().then(function() {
                        vm.gotoThemes();
                    });
                });

            });
        }


        /**
         * Go to products page
         */
        function gotoThemes()
        {
            $state.go('app.themes');
        }


    }
})();
