(function ()
{
    'use strict';

    angular
        .module('app.services')
        .factory('themeService', themeService);

    /** @ngInject */
    function themeService($q, $mdToast, api)
    {
        var service = {
            theme: undefined,
            getTheme: getTheme,
            rename: rename,
            getTimeline: getTimeline,
            saveTimeline: saveTimeline,
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
         * Get timeline
         */
        function getTimeline() {
            return service.theme.timeline;
        }

        
        /**
         * Save timeline
         */
        function saveTimeline(timeline) {

            if (service.theme === undefined) return $q.reject();
            var def = $q.defer();

            api.themes.update({id: service.theme._id}, {timeline: timeline},
                function(response) {
                    console.log(response);
                    service.theme.timeline = response;
                    showOk();
                    def.resolve();
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
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
                    showOk;
                    service.theme.name = newName;
                    def.resolve();
                },
                function(error) {
                    showError(error);
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
                    showError(error);
                    def.reject(error);
                });

            return def.promise;
        }


        /**
         * Internal methods
         */
        function showOk() {
            $mdToast.show(
                $mdToast.simple()
                        .textContent('Operación realizada correctamente')
                        .position('top right')
            );
        }

        function showError(error) {
            console.log(error);
            $mdToast.show(
                $mdToast.simple()
                        .textContent(error.data.errmsg || error.data.message)
                        .position('top right')
                        //.toastClass('md-warn-bg')
            );
        }
    }

})();