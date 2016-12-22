(function ()
{
    'use strict';

    angular
    .module('app.common')
    .directive('treemapViewer', [
        '$window',
        '$document',
    function(
        $window,
        $document
    ) {

        var $Window = angular.element($window);

        var controller =  [
            '$scope',
            '$element',
            'gameService',
        function(
            $scope,
            $element,
            gameService
        ) {

            // Namespace

            var vm = this;

            // Data

            vm.Map = gameService.budgetDistribution;

            // UI

            var $BlocksContainer;
            var ActualBlocks;
            var ActualBlockIndex;
            var TargetIsResizer;
            var TargetLastOrFirst;
            var Y;

            function mousemove(event) {

                var DeltaY = event.pageY - Y;
                Y = event.pageY;

                updateValue(ActualBlocks, ActualBlockIndex, $BlocksContainer.height(), DeltaY)
            }

            function mouseup() {

                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }

            function updateValue(Blocks, BlockIndex, Total, Delta) {

                var Inc = Delta * 100 / Total;

                if(TargetIsResizer) {

                    var UpperVal = Blocks[BlockIndex - 1].percent + Inc;
                    var LowerVal = Blocks[BlockIndex].percent - Inc;

                    if(UpperVal == 0 || LowerVal == 0) {

                        return;
                    }

                    $scope.$apply(function() {

                        Blocks[BlockIndex - 1].percent = UpperVal;
                        Blocks[BlockIndex].percent = LowerVal;
                        calculateData();
                    });
                } else {

                    var UpperVal = Blocks[BlockIndex - 1].percent + Inc;
                    var LowerVal = Blocks[BlockIndex + 1].percent - Inc;

                    if(UpperVal == 0 || LowerVal == 0) {

                        return;
                    }

                    $scope.$apply(function() {

                        Blocks[BlockIndex - 1].percent = UpperVal;
                        Blocks[BlockIndex + 1].percent = LowerVal;
                        calculateData();
                    });
                }
            }

            function calculateData(Data) {

                _.forEach(vm.Map.parts, function(Part) {

                    Part.budget = Math.floor(vm.Map.budget * Part.percent / 100);

                    _.forEach(Part.blocks, function(Block) {

                        Block.budget = Math.floor(Part.budget * Block.percent / 100);

                        if(Block.distributionTable) {

                            Block.distributionTableBudget = _.map(Block.distributionTable, function(Sector) {

                                return Math.floor(Sector * Block.budget / 100);
                            });
                        }

                        _.forEach(Block.steps, function(Step) {

                            Step.budget = Math.floor(Block.budget * Step.percent / 100);
                            Step.distributionTableBudget = _.map(Step.distributionTable, function(Sector) {

                                return Math.floor(Sector * Step.budget / 100);
                            });
                        });
                    });
                });
            }

            vm.getStyle = function(Block) {

                return {
                    'height': Block.percent + '%'
                }
            };

            vm.mousedown = function($event, Blocks, BlockIndex, IsResizer, LastOrFirst) {

                $event.preventDefault();
                $event.stopPropagation();

                if(!IsResizer && LastOrFirst) { return; }

                TargetIsResizer = IsResizer;
                TargetLastOrFirst = LastOrFirst;
                $BlocksContainer = $($event.currentTarget).parents('.Sections').eq(0);
                ActualBlocks = Blocks;
                ActualBlockIndex = BlockIndex;
                Y = $event.pageY;

                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

                return false;
            };

            vm.toggle = function($event) {

                var $ParentBlock = $($event.currentTarget).parents('.Section').eq(0);
                $ParentBlock.toggleClass('Opened');
            }

            // API

            $scope.save = function() {

                console.log(vm.Map);
            }

            $scope.undo = function() {

                $scope.Map = angular.copy(Map);
            }

            // Size

            function resize() {

                var $Parent = $element.parents('.md-no-scroll').eq(0);
                var PosY = $element.offset().top;
                var SpaceLeft = $Window.height() - PosY;

                console.log($Parent);

                $Parent.addClass('NoPadding');

                $element.css({ height: SpaceLeft + 'px' });
            }

            $Window.on('resize', resize);
            $scope.$on('initTreeMapViewer', resize);
            resize();
        }];

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/main/common/directives/treemap-viewer/treemap.html'
        };
    }])
    .directive('treemapViewerDistributiontable', function() {

        var controller = [
            '$scope',
        function(
            $scope
        ) {

            $scope.getStyle = function(Index) {

                return {
                    height: (100 / ($scope.data.length + 1)) + '%'
                }
            }

            $scope.getStyleSeparator = function(Index) {

                return {
                    height: (100 / ($scope.data.length + 1) / 2) + '%'
                }
            }

            $scope.getSectorStyle = function(Index) {

                return {
                    width: ($scope.data[Index] * 2) + 'px'
                }
            }

            $scope.getSectorBudget = function(Index) {

                return Math.floor($scope.data[Index]);
            }
        }];

        return {
            restrict: 'E',
            replace: true,
            scope: { data: '=data' },
            controller: controller,
            templateUrl: 'app/main/common/directives/treemap-viewer/distributiontable.html'
        };
    })
    .directive('treemapViewerResizer', function() {

        var controller = [function() { }];

        return {
            restrict: 'E',
            replace: true,
            controller: controller,
            templateUrl: 'app/main/common/directives/treemap-viewer/resizer.html'
        };
    });
})();