(function ()
{
    'use strict';

    angular
        .module('app.services')
        .factory('timelineService', timelineService);

    /** @ngInject */
    function timelineService($q, $mdToast, $filter)
    {
        var dataService;

        var service = {
            timeline: undefined,
            init: init,
            save: save,
            addNew: addNew,
            saveItem: saveItem,
            deleteItem: deleteItem
        };

        return service;

        //////////
        /**
         * Init
         */
        function init(ds) {

            service.timeline = ds.getTimeline();
            dataService = ds;
        }


        /**
         * Add new item
         */
        function addNew(item)
        {
            service.timeline.push(item);
        }

        /**
         * Save item
         */
        function saveItem(item) {
            var idx = findItemIndex(item._id);
            if (idx === undefined) return;
            service.timeline[idx] = angular.copy(item);
        }

        /**
         * Delete item
         */
        function deleteItem(item) {
            var idx = findItemIndex(item._id);
            service.timeline.splice(idx, 1);
        }

        /**
         * Save
         */
        function save() {
            return dataService.saveTimeline(service.timeline);
        }



        /**
         * Internal methods
         */
        function findItemIndex(id) {
            for (var r=0; r < service.timeline.length; r++) {
                if (service.timeline[r]._id === id) {
                    return r;
                }
            }
            return undefined;
        }
        function findItemById(id) {
            var idx = findItemIndex(id);
            if (idx === undefined) return undefined;
            return service.timeline[idx];
        }
    }

})();