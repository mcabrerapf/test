(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('timeLineViewController', timeLineViewController)
        .directive('timeLineView', timeLineViewDirective);

    /** @ngInject */
    function timeLineViewController($scope, $mdDialog, api)
    {
        var vm = this;
        vm.theme = $scope.theme;

        vm.sortableOptions = {
            start: function(e) {
                console.log('start');
            },
            change: function(e) {
                console.log('Item changed from ' + e.oldIndex + ' to ' + e.newIndex);
            }
        }

        vm.placeholder =function(element) {
                return element.clone().addClass("placeholder").text("Drop Here...");
            };
        vm.hint = function(element) {
            console.log(element);
                return element.clone().addClass("hint");
            };


        // Methods
        vm.openNewMenu = openNewMenu;
        vm.createNewStep = createNewStep;
        vm.createNewGoal = createNewGoal;
        vm.createNewMessage = createNewMessage;
        vm.createNewPost = createNewPost;
        vm.movedEvent = movedEvent;
        vm.getEventIcon = getEventIcon;


        vm.createNewGoal();
        vm.createNewMessage();
        vm.createNewStep();
        vm.createNewPost();
        vm.createNewMessage();
        vm.createNewStep();

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


        function movedEvent(event, index) {
            console.log('element moved ' + index);
            console.log(event);
            vm.theme.timeline.splice(index, 1);
        }

        /**
         * Create new Step
         */
        function createNewStep() {
            var newItem = {
                type: 'Step',
                start: new Date(),
                end: new Date(),
                data: {}
            }
            vm.theme.timeline.push(newItem);
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
            vm.theme.timeline.push(newItem);
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
            vm.theme.timeline.push(newItem);
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
            vm.theme.timeline.push(newItem);
        }

        /**
         * Returns the envet icon
         */
        function getEventIcon(eventType) {

            switch(eventType.toLowerCase()) {
                case 'step':
                    return 'icon-apple-safari';
                case 'goal':
                    return'icon-alarm-check';
                case 'message':
                    return 'icon-email';
                case 'post':
                    return 'icon-message-text';
            }
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