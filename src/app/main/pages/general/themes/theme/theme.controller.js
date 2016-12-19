(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('ThemeController', ThemeController);

    /** @ngInject */
    function ThemeController($q, $state, $mdDialog, $translate, api, theme)
    {
        var vm = this;

        // Data
        vm.theme = theme;
        vm.themeCopy = angular.copy(theme);


        // Methods
        vm.gotoThemes = gotoThemes;
        vm.deleteConfirm = deleteConfirm;
        vm.updateThemeName = updateTheme;


        /**
         * Update theme (name)
         */
        function updateTheme(newName) {

            if (newName === '') return $q.reject();
            var def = $q.defer();

            var id = vm.theme._id;

            api.themes.update({id:id}, {name: newName},
                function() {
                    vm.theme.name = newName;
                    vm.themeCopy.name = newName;
                    def.resolve();
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.log(error);
                    vm.themeCopy.name = vm.theme.name;
                    def.resolve();
                }
            );

            return def.promise;
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

                    api.themes.delete({id: vm.theme._id}, 
                        function() {

                            vm.gotoThemes();

                        }, function(error) {
                            alert(error.data.errmsg);
                            console.error(error);
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
