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
            selectable: true,
            editable: {
                add: true,
                updateTime: true,
                updateGroup: false,
                remove: true
            },
            template: function (item) {

                return '<span class="item-text">' + item.title + '</span>';

                var html = "";

                html += '<div><span class="item-text">' + item.title + '</span>';

                var s = vis.moment(item.start);
                if (item.end !== undefined && item.end !== null) {
                    var e = vis.moment(item.end);
                    html += '<md-tooltip>' + s.calendar() + ' al ' + e.calendar() + ' - ' + s.diff(e, 'days') + ' dias</md-tooltip>';
                } else {
                    html += '<md-tooltip>' + s.calendar() + '</md-tooltip>';
                }

                html += '</div>';

                var itemElement = $compile(html)($scope);
                return itemElement[0];



                
                var tooltipHTML = '<div class="vis-item-tooltip">';
                //var start = moment(item.start).format('L');
                //var end = (item.end ? moment(item.end).format('L') : '');

                tooltipHTML += '<h3 class="vis-tooltip-title">' + item.title + '</h3>';
                tooltipHTML += '<div>' + (item.end ? 'Del' : 'El') + ' <span class="vis-item-date-start">' + item.start + '</span>';
                if (item.end) tooltipHTML += ' al <span class="vis-item-date-end">' + item.end + '</span>';
                tooltipHTML += '</div>';

                return '<span class="item-text">' + item.title + '</span>';

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
                        delete newItem.type;
                        newItem.group = item.group;
                        callback(newItem);
                });
            },

            onMoving: function(item, callback) {

                if (item.start < new Date()) return;

                if (item.group === 1) {
                    // etapa!
                }
                callback(item);
            },

            onMove: function(item, callback) {
                if (item.end !== undefined && item.end !== null) {
                    if (item.end.valueOf() <= item.start.valueOf()) {
                        item.end = vis.moment(item.start).add(1, 'days');
                    }
                }
                item.type = item.dataType;
                timelineService.saveItem(item).then(function() {
                    delete item.type;
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

                    $mdDialog.show(confirm).then(function ()
                    {
                        timelineService.deleteItem(item);
                        callback(item);
                    });

                });
            },

            onUpdate: function(item, callback) {

                item.type = item.dataType;

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

                        if (modifiedItem === undefined) return;

                        modifiedItem.dataType = modifiedItem.type;
                        delete modifiedItem.type;
                        modifiedItem.group = item.group;
                        callback(modifiedItem);
                });
            }
            

        };


        function getVisTimelineData() {

            return vm.timeline.map(function(event) {

                var item = {
                    _id: event._id,
                    title: vis.moment(event.start).calendar(),
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