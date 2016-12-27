(function ()
{
    'use strict';

    angular
        .module('app.pages.general.distributions')
        .controller('DistributionController', DistributionController);

    /** @ngInject */
    function DistributionController($scope, $state, distribution, api, $translate, $mdDialog, $timeout)
    {
        var vm = this;

        // Data
        vm.distribution = distribution;
        vm.points = {
            first: distribution.distributionTable[0] | 0,
            last:  distribution.distributionTable[distribution.distributionTable.length - 1] | 0,
            total: getTotalPoints()
        }

        vm.flipped = {
            definition: false,
            distribution: false
        };
        
        // Methods
        vm.gotoList = gotoList;
        vm.saveDistribution = saveDistribution;
        vm.deleteDistributionConfirm = deleteDistributionConfirm;
        vm.editDefinition = editDefinition;
        vm.saveDefinition = saveDefinition;
        vm.editDistributionParams = editDistributionParams;
        vm.saveDistributionParams = saveDistributionParams;


        /////////////////
        init();


        /**
         * Initialize
         */
        function init()
        {
            generateTableData();
            fillTableData()

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

            $timeout(function() {
                vm.chart.resize();
            }, 200);
        }

        $(window).on("resize", function() {
            // $scope.chart.resize();
            kendo.resize($(".k-content"));
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
                data: new kendo.data.ObservableArray([])
            }];
        }


        function fillTableData() {

            // clean data 
            vm.tableData[0].data.splice(0, vm.tableData[0].data.length);

            // populate new data
            for(var r=0; r < vm.distribution.distributionTable.length; r++) {
                vm.tableData[0].data.push({
                    index: r+1,
                    value: vm.distribution.distributionTable[r]
                })
            }

            if (vm.chart !== undefined) {
                vm.chart.options.categoryAxis.categories = generateCategoryAxisArray();
            }
        }

        //////////



        /**
         * Edit distribution
         */
        function editDistributionParams() {

            vm.flipped.definition = false;
            vm.pointsEdit = {
                first: vm.points.first,
                last: vm.points.last
            };
            vm.distributionCopy = angular.copy(vm.distribution);
            vm.flipped.distribution = true;
        }

        /** 
         * Save distribution 
         * */
        function saveDistributionParams() {

            vm.distribution = angular.extend(vm.distribution, vm.distributionCopy);
            vm.points.first = vm.pointsEdit.first;
            vm.points.last = vm.pointsEdit.last;

            // Realizamos los cálculos para la nueva definición
            vm.distribution.distributionTable = [];

            var value = vm.points.first;
            var delta = (vm.points.first - vm.points.last) / (vm.distribution.participants - 1);
            delta = (delta * 100) / 100;
            for(var r=0; r < vm.distribution.participants -1; r++) {

                vm.distribution.distributionTable.push(Math.floor(value));
                value = (value - delta);
            }
            vm.distribution.distributionTable.push(vm.points.last);

            vm.points.total = getTotalPoints();
            vm.options.categoryAxis.categories = generateCategoryAxisArray();
            fillTableData();
            vm.chart.refresh();

            vm.saveDistribution();
        }
        
        /**
         * Edit definition
         */
        function editDefinition() {

            vm.flipped.distribution = false;
            vm.distributionCopy = angular.copy(vm.distribution);
            vm.flipped.definition = true;
        }

        /** 
         * Save definition 
         * */
        function saveDefinition() {

            vm.distribution = angular.extend(vm.distribution, vm.distributionCopy);
            vm.saveDistribution();
        }

        /**
         * Save distribution
         */
        function saveDistribution()
        {
            var id = vm.distribution._id;

            api.distributions.update({id: id}, vm.distribution,
                function(updatedDistribution) {

                    angular.forEach(vm.flipped, function(value, key) {
                        vm.flipped[key] = false;
                    });
                },
                function(error) {
                    alert(error.data.errmsg);
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

                            vm.gotoList();

                        }, function(error) {
                            alert(error.data.errmsg);
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