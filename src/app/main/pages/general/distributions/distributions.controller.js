(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions')
        .controller('DistributionsController', DistributionsController);

    /** @ngInject */
    function DistributionsController(distributions, api, $mdDialog, $state, $filter, $timeout)
    {
        var vm = this;

        vm.distributions = distributions;

        vm.gridOptions = {
            dataSource: {
                data: vm.distributions,
                /*
                schema: {
                    model: {
                        fields: {
                            name:               { type: 'string' },
                            description:        { type: 'string' },
                            type:               { type: 'string' },
                            participants:       { type: 'number' },
                            formula:            { type: 'string' },
                            distributionTable:  { type: 'array' }
                        }
                    }
                },
                */
                pageSize: 20
            },
//            height: 550,
            scrollable: true,
            sortable: true,
            filterable: true,
            navigatable: true,
            navigate: function(e) {
                var id = this.dataItem(e.element.parent())._id;
                $state.go('app.distributions.detail', {'id': id});
            },
            selectable: false, // 'single row',
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                { field: "name", title: "Name" },
                { field: "type", title: "Type", filterable: { multi: true, search: false }}
            ]
        };
        
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
