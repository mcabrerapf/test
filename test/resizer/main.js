
	function nameToClass(Name) {

		return Name.split(' ').join('_');
	}

	function percentualize(Data) {

		var Budget = Data.budget;

		_.forEach(Data.parts, function(Part) {

			Part.percent = 100 / Data.parts.length;
			Part.budget = Math.floor(Budget / Data.parts.length);
			Part.className = nameToClass(Part.name);

			_.forEach(Part.blocks, function(Block) {

				Block.percent = 100 / Part.blocks.length;
				Block.budget = Math.floor(Part.budget / Part.blocks.length);
				Block.className = nameToClass(Block.name);

				if(Block.distributionTable) {

					Block.distributionTableBudget = _.map(Block.distributionTable, function(Sector) {

						return Math.floor(Sector * Block.budget / 100);
					});
				}

				_.forEach(Block.steps, function(Step) {

					Step.percent = 100 / Block.steps.length;
					Step.budget = Math.floor(Block.budget / Block.steps.length);
					Step.className = nameToClass(Step.name);
					Step.distributionTableBudget = _.map(Step.distributionTable, function(Sector) {

						return Math.floor(Sector * Step.budget / 100);
					});
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

					_.forEach(BGTM.Map.parts, function(Part) {

						Part.budget = Math.floor(BGTM.Map.budget * Part.percent / 100);

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

		        BGTM.getStyle = function(Block) {

		        	return {
		        		'height': Block.percent + '%'
		        	}
		        };

				BGTM.mousedown = function($event, Blocks, BlockIndex, IsResizer, LastOrFirst) {

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

				BGTM.toggle = function($event) {

					var $ParentBlock = $($event.currentTarget).parents('.Section').eq(0);
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
						width: ($scope.data[Index]) + 'px'
					}
				}

				$scope.getSectorBudget = function(Index) {

					return Math.floor($scope.data[Index]);
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

			var controller =  function($scope, $element, $attrs) { };

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