(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('gamePointsViewController', gamePointsViewController)
        .directive('gamePointsView', gamePointsViewDirective);

    /** @ngInject */
    function gamePointsViewController(gameService, $translate)
    {
        var vm = this;

        // vm.gameService = gameService;

        // vm.kpiData = vm.gameService.game.kpiData;

        //////////

/***
        function runTimeline (timeline) {

            timeline.forEach(function(timelineEvent){
                evalTimelineEvent( timelineEvent );
            })

        };

        function evalTimelineEvent (timelineEvent) {

            switch (timelineEvent.type) {
                case 'Step':
                    console.log('evalTimelineEvent: Step');
                    break;
                case 'Message':
                    console.log('evalTimelineEvent: Message');
                    break;                    
                default;
                    console.log('evalTimelineEvent: ERROR: incorrect type');
            }

        };
***/
    }
    


    /** @ngInject */
    function gamePointsViewDirective()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: 'gamePointsViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/games/directives/game-points-view/game-points-view.html'
        };
    }
})();