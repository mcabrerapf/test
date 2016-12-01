(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions')
        .controller('DistributionController', DistributionController);

    /** @ngInject */
    function DistributionController($scope, $state, distribution, api, $translate, $mdDialog)
    {
        var vm = this;

        // Data
        vm.distribution = distribution;
        vm.points = {
            first: distribution.distributionTable[0],
            last:  distribution.distributionTable[distribution.distributionTable.length - 1],
            total: getTotalPoints()
        }
        
        // Methods
        vm.gotoList = gotoList;
        vm.saveDistribution = saveDistribution;
        vm.deleteDistributionConfirm = deleteDistributionConfirm;


        /////////////////
        init();


        /**
         * Initialize
         */
        function init()
        {
        }


        generateTableData();

        vm.options = {
            series: vm.tableData,
            legend: {
                visible: false
            },
            categoryAxis: {
                visible: true,
                categories: generateCategoryAxisArray(),
                line: {
                    visible: false
                }
            },
            tooltip: {
                visible: true,
                format: "{0}%",
                template: "#= dataItem.index #: #= dataItem.value #"
            }
        };

        $(window).on("resize", function() {
            // $scope.chart.resize();
            kendo.resize($(".k-content"));
        });


        $scope.$watch(function() { return vm.distribution.participants; }, function(newValue, oldValue) {
            
            if (newValue === undefined) return;

            var actualLength = vm.distribution.distributionTable.length;

            if (actualLength < newValue) {
                for(var r=0; r < newValue - actualLength; r++) {
                    vm.distribution.distributionTable.push(0);
                }
            }
            if (actualLength > newValue) {
                vm.distribution.distributionTable.splice(newValue, actualLength - newValue);
            }

            generateTableData();
        });


        
        function getTotalPoints() {
            return vm.distribution.distributionTable.reduce(function(a, b) {
                return a+b;
            }, 0);
        }

        function generateCategoryAxisArray() {
            var array = [];
            array.push(1);
            for(var r=1; r < vm.distribution.distributionTable.length - 1; r++) {
                array.push(undefined);
            }
            array.push(vm.distribution.distributionTable.length);
            return array;
        };

        function generateTableData() {
            vm.tableData = [{
                name: 'reparto',
                data: vm.distribution.distributionTable.map(function(v, i) {
                    return { index: i+1, value: v }; //parseInt(v);
                })
            }];
        }


        //////////
        function findIndex(id, array) {
            for(var r=0; r < array.length; r++) {
                if (array[r]._id === id) return r;
            }
            return -1;
        };


        /**
         * Save distribution
         */
        function saveDistribution()
        {
            var id = vm.distribution._id;
            delete vm.distribution._id;

            api.distributions.update({id: id}, vm.distribution,
                function(updatedDistribution) {

                    var idx = findIndex(updatedDistribution._id, vm.distributions);
                    if (idx > -1) {
                        angular.extend(vm.distributions[idx], vm.distribution);
                    }

                    closeDialog(updatedDistribution);
                },
                function(error) {
                    alert(error.data.msg);
                    console.error(error);
                });
        }

        /**
         * Delete Distribution Confirm Dialog
         */
        function deleteDistributionConfirm(ev)
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

                    api.distributions.delete({id: vm.distribution._id}, 
                        function() {

                            vm.distributions.splice(findIndex(vm.distribution._id, vm.distributions), 1);
                            closeDialog();

                        }, function(error) {
                            alert(error.data.msg);
                            console.error(error);
                        });
                });

            });
        }


        /**
         * Go to list page
         */
        function gotoList()
        {
            $state.go('app.distributions');
        }

    }
})();