(function ()
{
    'use strict';

    angular
        .module('app.pages.general.teams')
        .controller('TeamsController', TeamsController);

    /** @ngInject */
    function TeamsController(users, $scope, api, $mdDialog, $state, $filter, $timeout)
    {
        var vm = this;

        vm.users = users;

        var datasource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    api.teams.find(function (teams) {
                        options.success(teams);
                    }, function (error) {
                        options.error(error);
                    });
                },
                create: function(options) {

                },
                parameterMap: function (options, operation) {
                    if (operation !== 'read' && options.models) {
                        return {models: kendo.stringify(options.models)};
                    }
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: '_id',
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
            drop: function (e) {
                console.log('drop source', this.dataItem(e.sourceNode));
                console.log('drop source', this.dataItem(e.destinationNode));
            },
            select: function (e) {
                console.log('select', this.dataItem(e.node));
            }
        };

        // Methods
        // var list = $('#teamsList').data('kendoTreeView')
        // list.dataSource.data().toJSON()


    }
})();
