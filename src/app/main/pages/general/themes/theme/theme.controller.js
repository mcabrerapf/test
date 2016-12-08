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


        // Methods
        vm.gotoThemes = gotoThemes;
        vm.deleteConfirm = deleteConfirm;
        vm.updateThemeName = updateTheme;


        /**
         * Update theme (name)
         */
        function updateTheme(newName) {

            var def = $q.defer();

            var id = vm.theme._id;
            delete vm.theme._id;
            var originalName = vm.theme.name;
            vm.theme.name = newName;

            api.themes.update({id:id}, vm.theme,
                function() {
                    vm.theme._id = id;
                    def.resolve();
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.log(error);
                    vm.theme._id = id;
                    vm.theme.name = originalName;
                    def.reject();
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
