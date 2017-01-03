(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('gameKpisViewController', gameKpisViewController)
        .directive('gameKpisView', gameKpisViewDirective);

    /** @ngInject */
    function gameKpisViewController($scope, $element, $window, $mdDialog, gameService, $translate)
    {
        var vm = this;
        var $Window = angular.element($window);

        vm.gameService = gameService;
        vm.kpis = vm.gameService.game.kpis;

        vm.datatableOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false,
            responsive: true
        };

        $translate([
            "KPIS.NAME",
            "KPIS.TYPE",
            "KPIS.SCORE",
            "KPIS.PARTICIPANTS",
            "KPIS.TOTAL_POINTS"]).then(function (translateValues) {

                vm.gridOptions = {
                    dataSource: {
                        data: new kendo.data.ObservableArray(vm.kpis),
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


        function resize() {

            var $Parent = $element.parents('.md-no-scroll').eq(0);
            var PosY = $element.offset().top;
            var SpaceLeft = $Window.height() - PosY;

            $Parent.addClass('NoPadding');

            $element.css({ height: SpaceLeft + 'px' });
        }

        $Window.on('resize', resize);
        $scope.$on('initKpiViewer', resize);
        resize();


        // Methods
        vm.openKpiDialog = openKpiDialog;
        vm.deleteKpi = deleteKpi;


        //////////

        /**
         * Open KPI dialog
         */
        function openKpiDialog(event, kpi) {

            $mdDialog.show({
                controller         : 'KpiDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/games/dialogs/kpi-dialog/kpi-dialog.html',
                parent             : angular.element(document.body),
                targetEvent        : event,
                clickOutsideToClose: false,
                locals             : {
                    Kpi: kpi,
                    mode: (gameService.game.status==='En definición' ? 'edit' : 'display')
                }
            }).then(function(result) {

                if (result === 'removeKpi') {
                    vm.deleteKpi(kpi);
                } else {
                    vm.grid.dataSource.data(vm.kpis)
                }
            });
        }


        /**
         * Delete kpi
         */
        function deleteKpi(kpi) {

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
                    .targetEvent(event)
                    .ok(translationValues['FORMS.OK'])
                    .cancel(translationValues['FORMS.CANCEL']);

                $mdDialog.show(confirm).then(function ()
                {
                    gameService.removeKpi(kpi).then(function() {
                        vm.grid.dataSource.data(vm.kpis);
                    });
                });

            });
        }

    }
    


    /** @ngInject */
    function gameKpisViewDirective()
    {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: 'gameKpisViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/games/directives/game-kpis-view/game-kpis-view.html'
        };
    }
})();