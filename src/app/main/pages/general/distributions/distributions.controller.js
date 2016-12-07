(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions')
        .controller('DistributionsController', DistributionsController);

    /** @ngInject */
    function DistributionsController($scope, translateValues, api, $mdDialog, $state, $filter, $timeout)
    {
        var vm = this;

        api.distributions.find(function(distributions) {

            vm.distributions = distributions;

            vm.gridOptions = {
                dataSource: {
                    data: vm.distributions,
                    pageSize: 20
                },
                scrollable: true,
                sortable: true,
                filterable: true,
                navigatable: true,
                navigate: function(e) {
                    if (e.element[0].tagName === 'TH') return;
                    var id = this.dataItem(e.element.parent())._id;
                    $state.go('app.distributions.detail', {'id': id});
                },
                selectable: false, // 'single row',
                pageable: {
                    input: true,
                    numeric: false
                },
                columns: [
                    { field: "name", title: translateValues['DISTRIBUTION.NAME'] },
                    { field: "type", title: translateValues['DISTRIBUTION.TYPE'], filterable: { multi: true, search: false }},
                    { field: "participants", title: translateValues['DISTRIBUTION.PARTICIPANTS'], filterable: true },
                    {
                        field: null,
                        title: translateValues['DISTRIBUTION.TOTAL_POINTS'],
                        template: '#= distributionTable.reduce(function(a,b) { return a+b; }, 0) #'
                    }
                ]
            };
        });
        
        // Methods
        vm.createNew = createNew;



        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewDistributionDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/general/distributions/new-distribution/newdistribution-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: false
            }).then(function(distribution) {

                if (distribution === undefined) return;
                vm.distributions.push(distribution);

                $state.go('app.distributions.detail', {'id': distribution._id});

            });
        }
        

    }
})();
