(function () {
    'use strict';

    angular
        .module('app.pages.general.teams')
        .controller('TeamsController', TeamsController);

    /** @ngInject */
    function TeamsController(users, customers, $scope, api, $mdDialog, $state, $filter, $timeout) {
        var vm = this;

        vm.users = users;
        vm.customers = customers;
        vm.customer = '';

        var datasource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: function (options) {
                    console.log(options);
                    api.teams.tree({id: vm.customer, parent: options.data._id || 'root'}, function (teams) {
                        options.success(teams);
                    }, function (error) {
                        options.error(error);
                    });
                },
                create: function (options) {

                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: '_id',
                    hasChildren: true,
                    fields: {
                        name: {editable: true},
                        admin: {editable: true}
                    }
                }
            }
        })

        vm.gridOptions = {
            dataSource: datasource,
            dragAndDrop: true,
            dataTextField: 'name',
            drop: function (e) {
                console.log('drop source', this.dataItem(e.sourceNode));
                console.log('drop source', this.dataItem(e.destinationNode));
            },
            select: function (e) {
                vm.team = this.dataItem(e.node).id;
            }
        };

        // Methods
        vm.createNew = createNew;
        // var list = $('#teamsList').data('kendoTreeView')
        // list.dataSource.data().toJSON()


        function createNew(event) {

            $mdDialog.show({
                controller: 'NewTeamDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/pages/general/teams/new-team/newteam-dialog.html',
                locals: {
                    customer: vm.customer,
                    users: vm.users,
                    parentTeam: vm.team
                },
                parent: angular.element(document.body),
                targetEvent: event,
                clickOusideToClose: false
            }).then(function (team) {
                console.log(team);
            });
        }

        $scope.$watch('vm.customer', function(newValue, oldValue){
            $('#teamsList').data('kendoTreeView').dataSource.read();
        })


    }
})();
