(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('timeLineViewController', timeLineViewController)
        .directive('timeLineView', timeLineViewDirective);

    /** @ngInject */
    function timeLineViewController($scope, $translate, $mdDialog, api)
    {
        var vm = this;
        vm.theme = $scope.theme;


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

        init();

        /**
         * Initialize
         */
        function init()
        {
        }


        function openNewMenu($mdOpenMenu, ev) {
            // originatorEv = ev;
            $mdOpenMenu(ev);
        }


        /**
         * Drag & drop functions for timeline elements
         */
        function dragstartItem(timelineEvent) {

            angular.forEach(vm.theme.timeline, function(item) {
                delete item.selected;
            });
            timelineEvent.selected = true;
        }

        function dropedItem(index, item) {

            vm.theme.timeline = vm.theme.timeline.slice(0, index)
                                .concat(item)
                                .concat(vm.theme.timeline.slice(index));

            // server update!!
            return true;
        }

        function movedItem(index, timelineEvent) {
            vm.theme.timeline = vm.theme.timeline.filter(function(item) {
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
                    Container: vm.theme.timeline
                }
            });
        }

        /**
         * Create new Goal
         */
        function createNewGoal() {
            var newItem = {
                _id: new Date().valueOf(),
                type: 'Goal',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.theme.timeline.push(newItem);
        }

        /**
         * Create new Message
         */
        function createNewMessage() {
            var newItem = {
                _id: new Date().valueOf(),
                type: 'Message',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.theme.timeline.push(newItem);
        }

        /**
         * Create new Post
         */
        function createNewPost() {
            var newItem = {
                _id: new Date().valueOf(),
                type: 'Post',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.theme.timeline.push(newItem);
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
                    vm.theme.timeline.splice(index, 1);
                    /*
                    api.themes.timeline.delete({id: item._id},
                        function() {

                            vm.theme.timeline.slice(index, 1);

                        }, function(error) {
                            alert(error.data.errmsg);
                            console.error(error);
                        });
                    */
                });

            });
        }


        //////////


    }
    
    /** @ngInject */
    function timeLineViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'timeLineViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/time-line-view/time-line-view.html'
        };
    }
})();