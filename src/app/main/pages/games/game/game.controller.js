(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('GameController', GameController);

    /** @ngInject */
    function GameController($scope, $rootScope, $q, $state, $mdDialog, $translate, gameService)
    {
        var vm = this;

        // Data
        vm.gameService = gameService;
        vm.game = vm.gameService.game;
        vm.gameCopy = angular.copy(vm.game);


        // Methods
        vm.gotoGames = gotoGames;
        vm.deleteConfirm = deleteConfirm;
        vm.renameGame = renameGame;


        init();


        function init() {

            vm.data = {
                budget: 50000,
                name: 'Partida de test',
                goals: [
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
                ],
                regular: [
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
                ],
                rankings: [
                    // se reparte el dinero sobrante
                    {
                        id: 'xxxxxxxxxx',
                        name: 'Repartidores',
                        totalPlayers: 230,
                        percentage: 78,
                        steps: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Monaco',
                                percentage: 10,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Paris',
                                percentage: 15,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Barcelona',
                                percentage: 25,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Londres',
                                percentage: 0,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Texas',
                                percentage: 50,
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
                        percentage: 12,
                        steps: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Monaco',
                                percentage: 10,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Paris',
                                percentage: 15,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Barcelona',
                                percentage: 25,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Londres',
                                percentage: 0,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Texas',
                                percentage: 50,
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
                        percentage: 10,
                        steps: [
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Monaco',
                                percentage: 10,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Paris',
                                percentage: 15,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Barcelona',
                                percentage: 25,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Londres',
                                percentage: 0,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                            {
                                id: 'xxxxxxxxxx',
                                name: 'Texas',
                                percentage: 50,
                                distributionTable: [
                                    10,10,10,10,10,10,10,10,10,10
                                ]
                            },
                        ]
                    }
                ]
            }
        }



        /**
         * Update theme (name)
         */
        function renameGame(newName) {

            return gameService.rename(newName).then(function() {
                vm.gameCopy.name = newName;
                return true;
            }, function(error) {
                vm.gameCopy.name = vm.game.name;
                return false;
            });
        }


        /**
         * Delete Confirm Dialog
         */
        function deleteConfirm(ev)
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

                $mdDialog.show(confirm).then(function () {

                    gameService.remove().then(function() {
                        vm.gotoGames();
                    });
                });

            });
        }


        /**
         * Go to games page
         */
        function gotoGames()
        {
            $state.go('app.games');
        }

        /**
         * Advice to treemap-viewer directive
         */

        $scope.initBudgetManager = function($event) {

            $rootScope.$broadcast('initTreeMapViewer');
        }
    }
})();
