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
            return dataService.addTimeline(item);
        }

        /**
         * Save item
         */
        function saveItem(item) {
            return dataService.updateTimeline(item);
        }

        /**
         * Delete item
         */
        function deleteItem(item) {
            return dataService.removeTimeline(item);
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