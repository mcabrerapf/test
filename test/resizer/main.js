
	function nameToClass(Name) {

		return Name.split(' ').join('_');
	}

	function percentualize(Data) {

		_.forEach(Data.blocks, function(Block) {

			Block.percent = 100 / Data.blocks.length;
			Block.className = nameToClass(Block.name);

			_.forEach(Block.block, function(BlockBlock) {

				BlockBlock.percent = 100 / Block.block.length;
				BlockBlock.className = nameToClass(BlockBlock.name);

				if(BlockBlock.distributionTable) {

					var Total = _.sum(BlockBlock.distributionTable);

					BlockBlock.distributionTablePercent = _.map(BlockBlock.distributionTable, function(Sector) {

						return Sector * 100 / Total;
					});
				}

				_.forEach(BlockBlock.steps, function(Step) {

					Step.percent = 100 / BlockBlock.steps.length;
					Step.className = nameToClass(Step.name);

					if(Step.distributionTable) {

						var Total = _.sum(Step.distributionTable);

						Step.distributionTablePercent = _.map(Step.distributionTable, function(Sector) {

							return Sector * 100 / Total;
						});
					}
				});
			});
		});

		return Data;
	}

	(function(W, D, $) {

		var APP = angular.module('bg-treemap', []);

		APP
		.directive('bgTreemapMap', function($document) {

			var controller =  function($scope, $element, $attrs) {

				// Namespace

				BGTM = this;

				// Data

				var Map = percentualize(Data);
				BGTM.Map = angular.copy(Map);

				// UI

				var $BlocksContainer;
				var ActualBlocks;
				var ActualBlockIndex;
				var TargetIsResizer;
				var TargetLastOrFirst;
				var Y;

		        BGTM.getStyle = function(Block) {

		        	return {
		        		'height': Block.percent + '%'
		        	}
		        };

				var mousemove = function(event) {

					var DeltaY = event.pageY - Y;
					Y = event.pageY;

					updateValue(ActualBlocks, ActualBlockIndex, $BlocksContainer.height(), DeltaY)
				};

				var mouseup = function() {

					$document.unbind('mousemove', mousemove);
					$document.unbind('mouseup', mouseup);
				};

				var updateValue = function(Blocks, BlockIndex, Total, Delta) {

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
						});
					}
				};

				BGTM.mousedown = function($event, Blocks, BlockIndex, IsResizer, LastOrFirst) {

					$event.preventDefault();
					$event.stopPropagation();

					if(!IsResizer && LastOrFirst) { return; }

					TargetIsResizer = IsResizer;
					TargetLastOrFirst = LastOrFirst;
					$BlocksContainer = $($event.currentTarget).parents('.Blocks').eq(0);
					ActualBlocks = Blocks;
					ActualBlockIndex = BlockIndex;
					Y = $event.pageY;

					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);

					return false;
				};

				BGTM.toggle = function($event) {

					var $ParentBlock = $($event.currentTarget).parents('.Block').eq(0);
					$ParentBlock.toggleClass('Opened');
				}

				// API

		        $scope.save = function() {

		        	console.log(BGTM.Map);
		        }

		        $scope.undo = function() {

		        	$scope.Map = angular.copy(Map);
		        }
			};

			return {
		        restrict: 'E',
		        replace: true,
		        controller: controller,
				controllerAs: 'BGTM',
		        templateUrl: 'treemap.html'
		    };
		})
		.directive('bgTreemapDistributiontable', function() {

			var controller =  function($scope, $element, $attrs) {

				$scope.getStyle = function(Index) {

					return {
						height: (100 / $scope.data.length) + '%'
					}
				}

				$scope.getSectorStyle = function(Index) {

					return {
						width: $scope.data[Index] + '%'
					}
				}
			};

			return {
		        restrict: 'E',
		        replace: true,
		        scope: {
		        	data: '=data'
		        },
		        controller: controller,
		        templateUrl: 'distributiontable.html'
		    };
		})
		.directive('bgTreemapResizer', function() {

			var controller =  function($scope, $element, $attrs) {
			};

			return {
		        restrict: 'E',
		        replace: true,
		        controller: controller,
		        templateUrl: 'resizer.html'
		    };
		});

		$(function() {

			angular.bootstrap(D, [ APP.name ]);
		});

	})(window, document, jQuery);