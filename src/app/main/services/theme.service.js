(function ()
{
    'use strict';

    angular
        .module('app.services')
        .factory('themeService', themeService);

    /** @ngInject */
    function themeService($q, $mdToast, timelineService, api)
    {
        var service = {
            theme: undefined,
            getTheme: getTheme,
            rename: rename,
            getTimeline: getTimeline,
            addTimeline: addTimeline,
            removeTimeline: removeTimeline,
            updateTimeline: updateTimeline,
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
            var self = this;

            api.themes.findOne({id: id},
                function (response)
                {
                    service.theme = response;
                    timelineService.init(self);
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
         * addTimeline
         */
        function addTimeline(item) {

            if (service.theme === undefined) return $q.reject();
            var def = $q.defer();

            api.themes.timeline.save({id: service.theme._id}, item,
                function(response) {

                    delete response.$promise;
                    delete response.$resolved;
                    
                    service.theme.timeline.push(response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * removeTimeline
         */
        function removeTimeline(item) {

            if (service.theme === undefined) return $q.reject();
            var def = $q.defer();

            var id = item._id;

            api.themes.timeline.remove({

                    id: service.theme._id,
                    timeline: id
                
                }, 
                function(response) {

                    var idx = findItemIndex(id, service.theme.timeline);
                    if (idx !== undefined) service.theme.timeline.splice(idx, 1);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * updateTimeline
         */
        function updateTimeline(item) {

            if (service.theme === undefined) return $q.reject();
            var def = $q.defer();

            var id = item._id;

            api.themes.timeline.update({

                    id: service.theme._id,
                    timeline: id
                
                }, item,

                function(response) {

                    delete response.$promise;
                    delete response.$resolved;

                    var timeline = findItemById(id, service.theme.timeline);
                    angular.extend(timeline, response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Save timeline
         */
        function saveTimeline(timeline) {

            if (service.theme === undefined) return $q.reject();
            var def = $q.defer();

            api.themes.update({id: service.theme._id}, {timeline: timeline},
                function(response) {
                    service.theme.timeline = response.timeline;
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

        function findItemIndex(id, collection) {
            for(var r=0; r < collection.length; r++) {
                if (collection[r]._id.toString() === id) return r;
            }
            return undefined;
        }

        function findItemById(id, collection) {
            var idx = findItemIndex(id, collection);
            if (idx === undefined) return undefined;
            return collection[idx];
        }
    }

})();