(function ()
{
    'use strict';

    angular
        .module('app.common.timeline-viewer')
        .controller('timelineViewerController', timelineViewerController)
        .directive('timelineViewer', timelineViewerDirective);

    /** @ngInject */
    function timelineViewerController($scope, $element, $window, $translate, $mdDialog, $compile, timelineService, VisDataSet)
    {
        var vm = this;
        var $Window = angular.element($window);

        vm.timeline = timelineService.timeline;

        vm.data = {
            groups: new VisDataSet([
                { id: 1, content: 'Etapas', type: 'Step' },
                { id: 2, content: 'Mensajes', type: 'Message' },
                { id: 3, content: 'Blog', type: 'Post' },
                { id: 4, content: 'Retos', type: 'Goal' },
//                { id: 5, content: 'Premios regularidad', type: 'Regularity' }
            ])
        };
        vm.data.items = new VisDataSet(getVisTimelineData(vm.timeline), { fieldId: '_id' }),


        vm.options = {
            minHeight: '200px',
            locales: {
                es: {
                    current: 'hoy',
                    time: 'hora'
                }
            },
            locale: 'es',
            orientation: {
                axis: 'top'
            },
            moment: function (date) {
                return vis.moment(date).utc(); // utcOffset(new Date().getTimezoneOffset() * -1);
            },
            min: new Date('2015/1/1'),
//            max: new Date('2020/1/1'),
            zoomMin: 1000 * 60 * 60 * 24 * 7,          // 2 weeks
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 6,     // about 6 months in milliseconds
            snap: function (date, scale, step) {
                var day = 24 * 60 * 60 * 1000;
                return Math.round(date / day) * day;
            },
            tooltipOnItemUpdateTime: {

                template: function(item) {

                    var ret = vis.moment(item.start).utc().calendar();

                    if (item.end !== undefined && item.end !== null) {
                        ret += ' - ' + vis.moment(item.end).utc().calendar();
                        var diff = vis.moment(item.end).diff(vis.moment(item.start), 'days');
                        ret += ' (' + diff + ' dias)  ';
                    }

                    return ret;
                }
            },
            selectable: true,
            editable: {
                add: true,
                updateTime: true,
                updateGroup: false,
                remove: true
            },
            groupTemplate: function(group, element) {
                // $(element).addClass('md-accent-fg');
                var html = '';
                html += '<div flex layout="row" layout-align="none center" class="m-10">';
                html += '    <md-icon flex="none" class="s40 md-accent-fg" md-font-icon="{{\'' + group.type + '\' | timelineIcon}}"></md-icon>';
                html += '    <div flex class="m-10">' + group.content + '</div>';
                html += '</div>';
                var groupLabel = $compile(html)($scope);
                return groupLabel[0];
            },


            // EVENTS

            onAdd: function (item, callback) {

                delete item._id;
                item.group = item.group || 1;
                item.type = vm.data.groups.get(item.group).type;

                if (item.type === 'Step') {
                    item.end = vis.moment(item.start).add(7, 'days');
                }
                if (item.type === 'Goal') {
                    item.end = vis.moment(item.start).add(5, 'days');
                }

                $mdDialog.show({
                        controller         : item.type  + 'DialogController',
                        controllerAs       : 'vm',
                        templateUrl        : 'app/main/dialogs/' + item.type.toLowerCase() + '/' + item.type.toLowerCase() + '-dialog.html',
                        parent             : angular.element(document.body),
                        // targetEvent        : ev,
                        clickOutsideToClose: true,
                        locals             : {
                            Element:            item
                        }
                    }).then(function(newItem) {

                        if (newItem === undefined) return;

                        newItem.dataType = newItem.type;
                        newItem.group = item.group;
                        newItem.content = newItem.title;
                        delete newItem.title;
                        delete newItem.type;
                        callback(newItem);
                });
            },

            onMoving: function(item, callback) {

                if (item.start < new Date()) return callback(null);

                if (item.end !== undefined && item.end !== null) {
                    if (item.end.valueOf() <= item.start.valueOf()) {
                        item.end = vis.moment(item.start).add(1, 'days');
                    }
                }

                if (item.group === -1) {

                    var selId = vm.timelineControl.getSelection()[0];
                    var dataItem = vm.data.items.get(selId);

                    var filter;
                    var diffStart = vis.moment(item.start).diff(vis.moment(dataItem.start), 'days');
                    var diffEnd = vis.moment(item.end).diff(vis.moment(dataItem.end), 'days');

                    if (diffStart === diffEnd) {
                        filter = {
                            filter: function(itemToFilter) {
                                if (itemToFilter._id === dataItem._id) return false;
                                return vis.moment(itemToFilter.start).diff(vis.moment(dataItem.start), 'days') >= 0;
                            }
                        };
                    }
                    /*
                    if (diffStart !== 0) {
                        // move by start
                        console.log('from start: ' + diffStart);
                    } else {
                        if (diffEnd !== 0) {
                            console.log('from end: ' + diffEnd);
                        }
                    }
                    */

//                    start && end --> tot >= start
//                                  suma a start i a end
//                    end --> tot que each.start >= end
//                                  suma a start i a end
//                            tot que each.end == end
//                                  suma a end
//                    start --> tot >= start && < end

                    if (filter !== undefined) {
                        console.log('-------------------- DIFF ' + diffStart);
                        vm.data.items.forEach(function(relatedItem) {
                            console.log(relatedItem.content);
                            var originalItem = getOriginalItem(relatedItem._id);
                            relatedItem.start = vis.moment(originalItem.start).add(diffStart, 'days');
                            if (relatedItem.end !== undefined && diffEnd !== 0) {
                                relatedItem.end = vis.moment(originalItem.end).add(diffEnd, 'days');
                            }
                            vm.data.items.update(relatedItem);
                        }, filter);
                    }
                }

                callback(item);
            },

            onMove: function(item, callback) {
                /*
                // update all timeline dates
                for(var r=0; r < vm.timeline.length; r++) {
                    var timelineEvent = vm.timeline[r];
                    if (timelineEvent._id === item._id) {
                        timelineEvent.start = item.start;
                        timelineEvent.end = item.end;
                    } else {
                        var dataItem = vm.data.items.get(timelineEvent._id);
                        timelineEvent.start = dataItem.start;
                        timelineEvent.end = dataItem.end;
                    }
                }
                timelineService.save(vm.timeline).then(function() {
                    callback(item);
                });
                */
                item.type = item.dataType;
                item.title = item.content;
                timelineService.saveItem(item).then(function() {
                    item.content = item.title;
                    delete item.type;
                    delete item.title;
                    callback(item);
                });
            },

            onRemove: function(item, callback) {

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
                        .ok(translationValues['FORMS.OK'])
                        .cancel(translationValues['FORMS.CANCEL']);

                    $mdDialog.show(confirm).then(function () {
                        timelineService.deleteItem(item);
                        callback(item);
                    });

                });
            },

            onUpdate: function(item, callback) {

                item.type = item.dataType;
                item.title = item.content;

                $mdDialog.show({
                        controller         : item.type  + 'DialogController',
                        controllerAs       : 'vm',
                        templateUrl        : 'app/main/dialogs/' + item.type.toLowerCase() + '/' + item.type.toLowerCase() + '-dialog.html',
                        parent             : angular.element(document.body),
                        // targetEvent        : ev,
                        clickOutsideToClose: true,
                        locals             : {
                            Element:            item
                        }
                    }).then(function(modifiedItem) {

                        if (modifiedItem === undefined) return callback(null);

                        modifiedItem.dataType = modifiedItem.type;
                        modifiedItem.group = item.group;
                        modifiedItem.content = modifiedItem.title;
                        delete modifiedItem.title;
                        delete modifiedItem.type;
                        callback(modifiedItem);
                });
            }
            

        };


        function getOriginalItem(id) {
            for(var r=0; r < vm.timeline.length; r++) {
                if (vm.timeline[r]._id === id) return vm.timeline[r];
            }
        }


        function getVisTimelineData() {

            return vm.timeline.map(function(event) {

                var item = {
                    _id: event._id,
                    content: event.title,
                    start: new Date(event.start),
                    end: event.end ? new Date(event.end) : null,
                    group: 2,
                    data: event.data,
                    dataType: event.type
                };

                var group = vm.data.groups.get({
                    filter: function(i) { return i.type == event.type }
                });
                item.group = group.length > 0 ? group[0].id : 1;

                return item;
            });
        }


        // Methods


        function resize() {
            var $Parent = $element.parents('.md-no-scroll').eq(0);
            var PosY = $element.offset().top;
            var SpaceLeft = $Window.height() - PosY;

            $Parent.addClass('NoPadding');

            $element.css({ height: SpaceLeft + 'px' });
        }

        $Window.on('resize', resize);
        $scope.$on('initTimeline', resize);
        resize();
    }

    
    /** @ngInject */
    function timelineViewerDirective()
    {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            controller: 'timelineViewerController',
            controllerAs: 'vm',
            templateUrl: 'app/main/common/directives/timeline-viewer/timeline-viewer.html'
        };
    }
})();