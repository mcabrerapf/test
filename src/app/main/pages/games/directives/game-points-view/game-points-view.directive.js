(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('gamePointsViewController', gamePointsViewController)
        .directive('gamePointsView', gamePointsViewDirective);

    /** @ngInject */
    function gamePointsViewController($scope, api, gameService, $translate)
    {
        var vm = this;

        vm.gameService = gameService;
        vm.game = vm.gameService.game;
        vm.kpiData = vm.game.kpiData;

        
/***
        $translate([
            "KPIS.NAME",
            "KPIS.TYPE",
            "KPIS.SCORE",
            "KPIS.PARTICIPANTS",
            "KPIS.TOTAL_POINTS"]).then(function (translateValues) {

                vm.treeList.options = {
                    dataSource: {
                        data: new kendo.data.ObservableArray( vm.kpiData ),
                        pageSize: 20
                    },
                    scrollable: true,
                    sortable: true,
                    filterable: true,
                    navigatable: true,
                    navigate: function(e) {
                        if (e.element[0].tagName === 'TH') return;
                        var kpi = this.dataItem(e.element.parent());
                        vm.openKpiDialog(e, kpi);
                    },
                    selectable: false, // 'single row',
                    pageable: {
                        input: true,
                        numeric: false
                    },
                    columns: [
                        { field: "name", title: translateValues['KPIS.NAME'] },
                        { field: "type", title: translateValues['KPIS.TYPE'], filterable: { multi: true, search: false }},
                        { field: "score.type", title: translateValues['KPIS.SCORE'] },
                        { 
                            field: null,
                            title: translateValues['KPIS.PARTICIPANTS'],
                            template: '#= score.type=="distribution" ? score.distribution.length : "" #'
                        },
                        {
                            field: null,
                            title: translateValues['KPIS.TOTAL_POINTS'],
                            template: '#= score.type=="distribution" ? score.distribution.reduce(function(a,b) { return a+b; }, 0) : "" #'
                        }
                    ],
                    height: '100%'
                };
        });
***/


        //////////

        vm.getKpiData = function() {
            api.games.kpidata.findOne(
                {
                    id:     vm.game._id
                },

                function (result) {
                    console.log('getKpiData: OK', result);

                    // vm.grid.dataSource.data( kpiData2Array(result) );
                },
                function (error) {
                    console.log('getKpiData: ERROR', error);
                }                    
            );
        };

        $scope.$on('initPointsView', vm.getKpiData);

        //////////

        function kpiData2Array (kpidata) {
            var array = [];

            angular.forEach( kpidata, function(value1, key1) {

                // key1

                angular.forEach( value1, function(value2, key2) {

                })

            });

            return array;
        };     
    };


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
    };
})();