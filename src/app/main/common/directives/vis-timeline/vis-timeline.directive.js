angular.module('ngVis', [])

    .factory('VisDataSet', function () {
        'use strict';
        return function (data, options) {
            // Create the new dataSets
            return new vis.DataSet(data, options);
        };
    })

/**
 * TimeLine directive
 */
    .directive('visTimeline', function () {
        'use strict';
        return {
            restrict: 'A',
            transclude: false,
            scope: {
                timeline: '=visTimeline',
                data: '=',
                options: '=',
                events: '='
            },
            link: function (scope, element, attr) {
                var timelineEvents = [
                    'rangechange',
                    'rangechanged',
                    'timechange',
                    'timechanged',
                    'select',
                    'doubleClick',
                    'click',
                    'contextmenu'
                ];

                // Declare the timeline
                scope.timeline = null;

                scope.$watch('data', function () {
                    // Sanity check
                    if (scope.data == null) {
                        return;
                    }

                    // If we've actually changed the data set, then recreate the graph
                    // We can always update the data by adding more data to the existing data set
                    if (scope.timeline != null) {
                        scope.timeline.destroy();
                    }

                    // Create the timeline object
                    scope.timeline = new vis.Timeline(element[0], scope.data.items, scope.data.groups, scope.options);

                    // Attach an event handler if defined
                    angular.forEach(scope.events, function (callback, event) {
                        if (timelineEvents.indexOf(String(event)) >= 0) {
                            scope.timeline.on(event, callback);
                        }
                    });

                    // onLoad callback
                    if (scope.events != null && scope.events.onload != null &&
                        angular.isFunction(scope.events.onload)) {
                        scope.events.onload(scope.timeline);
                    }
                });

                scope.$watchCollection('options', function (options) {
                    if (scope.timeline == null) {
                        return;
                    }
                    scope.timeline.setOptions(options);
                });
            }
        };
    });
    