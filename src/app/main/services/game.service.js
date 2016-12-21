(function ()
{
    'use strict';

    angular
        .module('app.services')
        .factory('gameService', gameService);

    /** @ngInject */
    function gameService($q, $mdToast, $filter, api)
    {
        var service = {
            game: undefined,
            getGame: getGame,
            rename: rename,
            getTimeline: getTimeline,
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
            api.games.findOne({id: id},
                function (response)
                {
                    service.game = response;
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
         * Save timeline
         */
        function saveTimeline(timeline) {

            if (service.game === undefined) return $q.reject();
            var def = $q.defer();

            api.games.update({id: service.game._id}, {timeline: timeline},
                function(response) {
                    console.log(response);
                    service.game.timeline = response;
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
                budget: service.game.budget,
                parts: [
                    {
                        name: 'Goals',
                        budget: null,
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 1',
                                budget: 1000,               // editable
                                distributionTable: [
                                    40,30,20,15
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 2',
                                budget: 800,                // editable
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Reto 3',
                                budget: 1000,
                                distributionTable: [
                                    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2
                                ]
                            }
                        ]
                    },
                    {
                        name: 'regular',
                        budget: null,
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Premio regularidad mitad partida',
                                budget: 400,
                                distributionTable: [
                                    25,25,25,25
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Premio regularidad final partida',
                                budget: 1000,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            }
                        ]
                    },
                    {
                        name: 'rankings',
                        budget: null,
                        blocks: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Repartidores',
                                totalPlayers: 230,
                                budget: null,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        budget: null,
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
                                budget: null,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        budget: null,
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
                                budget: null,
                                steps: [
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Monaco',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Paris',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Barcelona',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Londres',
                                        budget: null,
                                        distributionTable: [
                                            10,10,10,10,10,10,10,10,10,10
                                        ]
                                    },
                                    {
                                        id: 'xxxxxxxxxx',
                                        name: 'Texas',
                                        budget: null,
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

            service.budgetDistribution = distribution;
            return distribution;
        }
    }

})();