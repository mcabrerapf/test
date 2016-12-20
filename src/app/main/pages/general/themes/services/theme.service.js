(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .factory('themeService', themeService);

    /** @ngInject */
    function themeService($q, $mdToast, api)
    {
        var service = {
            theme: undefined,
            getTheme: getTheme,
            rename: rename,
            remove: remove
        };

        return service;

        //////////

        /**
         * Get theme
         */
        function getTheme(id)
        {
            var deferred = $q.defer();
            api.themes.findOne({id: id},
                function (response)
                {
                    service.theme = response;
                    deferred.resolve(service.theme);
                },
                function (response)
                {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }


        /**
         * Rename theme
         */
        function rename(newName) {

            if (newName === '') return $q.reject();
            if (service.theme === undefined) return $q.reject();

            var def = $q.defer();

            var id = service.theme._id;

            api.themes.update({id:id}, {name: newName},
                function() {

                    $mdToast.show(
                        $mdToast.simple()
                                .textContent('Operación realizada correctamente')
                                .position('top right')
                    );

                    service.theme.name = newName;
                    def.resolve();
                },
                function(error) {
                    $mdToast.show(
                        $mdToast.simple()
                                .textContent(error.data.errmsg)
                                .position('top right')
//                                .toastClass('md-warn-bg')
                    );
                    console.log(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Remove theme
         */
        function remove() {

            if (service.theme === undefined) return $q.reject();
            
            var def = $q.defer();

            api.themes.delete({id: service.theme._id}, 
                function() {

                    service.theme = undefined;
                    def.resolve();

                }, function(error) {
                    $mdToast.show(
                        $mdToast.simple()
                                .textContent(error.data.errmsg)
                                .position('top right')
//                                .toastClass('md-warn-bg')
                    );
                    console.log(error);
                    def.reject(error);
                });

            return def.promise;
        }
    }

})();