(function ()
{
    'use strict';

    angular
        .module('app.common.timeline-viewer')
        .controller('timelineViewerController', timelineViewerController)
        .directive('timelineViewer', timelineViewerDirective);

    /** @ngInject */
    function timelineViewerController($scope, $element, $window, $translate, $mdDialog, timelineService)
    {
        var vm = this;
        var $Window = angular.element($window);

        vm.timeline = timelineService.timeline;

        // Methods
        vm.openNewMenu = openNewMenu;
        vm.openElementDialog = openElementDialog;
        vm.movedItem = movedItem;
        vm.dropedItem = dropedItem;
        vm.dragstartItem = dragstartItem;
        vm.deleteConfirm = deleteConfirm;


        //////////
        function openNewMenu($mdOpenMenu, ev) {
            // originatorEv = ev;
            $mdOpenMenu(ev);
        }



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


        /**
         * Drag & drop functions for timeline elements
         */
        function dragstartItem(timelineEvent) {

            angular.forEach(vm.timeline, function(item) {
                delete item.selected;
            });
            timelineEvent.selected = true;
        }

        function dropedItem(index, item) {

            timelineService.timeline = vm.timeline.slice(0, index)
                                .concat(item)
                                .concat(vm.timeline.slice(index));

            return true;
        }

        function movedItem(index, timelineEvent) {
            timelineService.timeline = timelineService.timeline.filter(function(item) {
                return !item.selected;
            });
            vm.timeline = timelineService.timeline;
            timelineService.save();
        }




        /**
         * Create new Step
         */
        function openElementDialog(ev, type, element) {

            $mdDialog.show({
                controller         : type  + 'DialogController',
                controllerAs       : 'vm',
                templateUrl        : ('app/main/dialogs/' + type + '/' + type + '-dialog.html').toLowerCase(),
                parent             : angular.element(document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Element:            element
                }
            });
        }


        /**
         * Delete Confirm Dialog
         */
        function deleteConfirm(ev, index, item)
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
                    timelineService.deleteItem(item);
                    timelineService.save();
                    return true;
                });

            });
        }


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