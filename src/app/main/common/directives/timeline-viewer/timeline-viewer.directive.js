(function ()
{
    'use strict';

    angular
        .module('app.common.timeline-viewer')
        .controller('timelineViewerController', timelineViewerController)
        .directive('timelineViewer', timelineViewerDirective);

    /** @ngInject */
    function timelineViewerController($scope, $translate, $mdDialog)
    {
        var vm = this;
        vm.dataService = $scope.dataService;
        vm.timeline = vm.dataService.getTimeline();

        // Methods
        vm.openNewMenu = openNewMenu;
        vm.openElementDialog = openElementDialog;
        vm.createNewGoal = createNewGoal;
        vm.createNewMessage = createNewMessage;
        vm.createNewPost = createNewPost;
        vm.movedItem = movedItem;
        vm.dropedItem = dropedItem;
        vm.dragstartItem = dragstartItem;
        vm.deleteConfirm = deleteConfirm;


        //////////
        function openNewMenu($mdOpenMenu, ev) {
            // originatorEv = ev;
            $mdOpenMenu(ev);
        }


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

            vm.timeline = vm.timeline.slice(0, index)
                                .concat(item)
                                .concat(vm.timeline.slice(index));

            vm.dataService.saveTimeline(vm.timeline);
            return true;
        }

        function movedItem(index, timelineEvent) {
            vm.timeline = vm.timeline.filter(function(item) {
                return !item.selected;
            });
        }




        /**
         * Create new Step
         */
        function openElementDialog(ev, type, element) {

            $mdDialog.show({
                controller         : 'StepDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dialogs/step/step-dialog.html',
                parent             : angular.element(document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                locals             : {
                    Element: element,
                    Container: vm.timeline
                }
            });
        }

        /**
         * Create new Goal
         */
        function createNewGoal() {
            var newItem = {
                type: 'Goal',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.timeline.push(newItem);
        }

        /**
         * Create new Message
         */
        function createNewMessage() {
            var newItem = {
                type: 'Message',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.timeline.push(newItem);
        }

        /**
         * Create new Post
         */
        function createNewPost() {
            var newItem = {
                type: 'Post',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.timeline.push(newItem);
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
                    vm.timeline.splice(index, 1);
                    vm.dataService.saveTimeline(vm.timeline);
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
            scope: {
                dataService: '=dataservice'
            },
            controller: 'timelineViewerController',
            controllerAs: 'vm',
            templateUrl: 'app/main/common/directives/timeline-viewer/timeline-viewer.html'
        };
    }
})();