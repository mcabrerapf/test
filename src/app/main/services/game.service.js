(function ()
{
    'use strict';

    angular
        .module('app.services')
        .factory('gameService', gameService);

    /** @ngInject */
    function gameService($q, $mdToast, $filter, timelineService, api)
    {
        var service = {
            game: undefined,
            getGame: getGame,
            rename: rename,
            addKpi: addKpi,
            removeKpi: removeKpi,
            updateKpi: updateKpi,
            getTimeline: getTimeline,
            addTimeline: addTimeline,
            removeTimeline: removeTimeline,
            updateTimeline: updateTimeline,
            saveTimeline: saveTimeline,
            saveBudget: saveBudget,
            remove: remove
        };

        return service;

        //////////

        /**
         * Get game
         */
        function getGame(id)
        {
            var deferred = $q.defer();
            var self = this;

            api.games.findOne({id: id},
                function (response)
                {
                    service.game = response;
                    timelineService.init(self);
                    updateBudgetDistribution();
                    deferred.resolve(service.game);
                },
                function (response)
                {
                    deferred.reject(response);
                }
            );

            return deferred.promise;
        }


        /**
         * Get timeline
         */
        function getTimeline() {
            return service.game.timeline;
        }


        /**
         * addTimeline
         */
        function addTimeline(item) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            api.games.timeline.save({id: service.game._id}, item,
                function(response) {

                    delete response.$promise;
                    delete response.$resolved;
                    
                    service.game.timeline.push(response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * removeTimeline
         */
        function removeTimeline(item) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            var id = item._id;

            api.games.timeline.remove({

                    id: service.game._id,
                    timeline: id
                
                }, 
                function(response) {

                    var idx = findItemIndex(id, service.game.timeline);
                    if (idx !== undefined) service.game.timeline.splice(idx, 1);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * updateTimeline
         */
        function updateTimeline(item) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            var id = item._id;

            api.games.timeline.update({

                    id: service.game._id,
                    timeline: id
                
                }, item,

                function(response) {

                    delete response.$promise;
                    delete response.$resolved;

                    var timeline = findItemById(id, service.game.timeline);
                    angular.extend(timeline, response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Save timeline
         */
        function saveTimeline(timeline) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            api.games.update({id: service.game._id}, {timeline: timeline},
                function(response) {
                    service.game.timeline = response.timeline;
                    showOk();
                    def.resolve();
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Save budget
         */
        function saveBudget() {
            showOk();
        }

        /**
         * Rename game
         */
        function rename(newName) {

            if (newName === '') return $q.reject();
            if (service.game === undefined) return $q.reject();

            var def = $q.defer();

            var id = service.game._id;

            api.games.update({id:id}, {name: newName},
                function() {
                    showOk();
                    service.game.name = newName;
                    def.resolve();
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Remove game
         */
        function remove() {

            if (service.game === undefined) return $q.reject();

            var def = $q.defer();

            api.games.delete({id: service.game._id},
                function() {
                    service.game = undefined;
                    def.resolve();
                }, function(error) {
                    showError(error);
                    def.reject(error);
                });

            return def.promise;
        }


        /**
         * addKpi
         */
        function addKpi(kpi) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            api.games.kpis.save({id: service.game._id}, kpi,
                function(response) {

                    delete response.$promise;
                    delete response.$resolved;
                    
                    service.game.kpis.push(response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * removeKpi
         */
        function removeKpi(kpi) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            var id = kpi._id;

            api.games.kpis.remove({

                    id: service.game._id,
                    kpi: id
                
                }, 
                function(response) {

                    var idx = findItemIndex(id, service.game.kpis);
                    if (idx !== undefined) service.game.kpis.splice(idx, 1);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }

        /**
         * updateKpi
         */
        function updateKpi(item) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            var id = item._id;

            api.games.kpis.update({

                    id: service.game._id,
                    kpi: id
                
                }, item,

                function(response) {

                    delete response.$promise;
                    delete response.$resolved;

                    var kpi = findItemById(id, service.game.kpis);
                    angular.extend(kpi, response);

                    showOk();
                    def.resolve(response);
                },
                function(error) {
                    showError(error);
                    def.reject(error);
                }
            );

            return def.promise;
        }


        /**
         * Internal methods
         */
        function showOk() {
            $mdToast.show(
                $mdToast.simple()
                        .textContent('Operación realizada correctamente')
                        .position('top right')
            );
        }

        function showError(error) {
            console.log(error);
            $mdToast.show(
                $mdToast.simple()
                        .textContent(error.data.errmsg || error.data.message)
                        .position('top right')
                        //.toastClass('md-warn-bg')
            );
        }

        function findItemIndex(id, collection) {
            for(var r=0; r < collection.length; r++) {
                if (collection[r]._id.toString() === id) return r;
            }
            return undefined;
        }

        function findItemById(id, collection) {
            var idx = findItemIndex(id, collection);
            if (idx === undefined) return undefined;
            return collection[idx];
        }

        function percentualizeDistribution(Data) {

            var Budget = Data.budget;

            _.forEach(Data.parts, function(Part) {

                Part.percent = 100 / Data.parts.length;
                Part.budget = Math.floor(Budget / Data.parts.length);

                _.forEach(Part.blocks, function(Block) {

                    Block.percent = 100 / Part.blocks.length;
                    Block.budget = Math.floor(Part.budget / Part.blocks.length);

                    if(Block.distributionTable) {

                        Block.distributionTableBudget = _.map(Block.distributionTable, function(Sector) {

                            return Math.floor(Sector * Block.budget / 100);
                        });
                    }

                    _.forEach(Block.steps, function(Step) {

                        Step.percent = 100 / Block.steps.length;
                        Step.budget = Math.floor(Block.budget / Block.steps.length);
                        Step.distributionTableBudget = _.map(Step.distributionTable, function(Sector) {

                            return Math.floor(Sector * Step.budget / 100);
                        });
                    });
                });
            });

            return Data;
        }

        function updateBudgetDistribution() {

            var goals = service.game.timeline
                                    .filter(function(event) {
                                        return event.type === 'Goal' &&
                                               event.data.type === 'Money';
                                    })
                                    .map(function(goal) {
                                        return {
                                            id: goal._id,
                                            name: goal.title,
                                            budget: goal.data.money.budget,
                                            distributionTable: goal.data.money.distributionTable
                                        }
                                    });

            var distribution = {
                name: service.game.name,
                budget: 3000, // service.game.budget,
                parts: [
                    {
                        name: 'Retos',
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 1',
                                distributionTable: [
                                    20,20,20,20,20
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 2',
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 3',
                                distributionTable: [
                                    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Premios a la regularidad',
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Mitad partida',
                                distributionTable: [
                                    25,25,25,25
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Final partida',
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            }
                        ]
                    },
                    {
                        name: 'Rankings',
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Repartidores',
                                totalPlayers: 230,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                ]

                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Teleoperadoras',
                                totalPlayers: 20,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Otros',
                                totalPlayers: 4,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                ]
                            }
                        ]
                    }
                ]
            };

            service.budgetDistribution = percentualizeDistribution(distribution);
            return service.budgetDistribution;
        }
    }

})();