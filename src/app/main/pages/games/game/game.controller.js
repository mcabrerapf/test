(function ()
{
    'use strict';

    angular
        .module('app.pages.games')
        .controller('GameController', GameController);

    /** @ngInject */
    function GameController($q, $state, $mdDialog, $translate, api, game)
    {
        var vm = this;

        // Data
        vm.game = game;
        vm.gameCopy = angular.copy(game);


        // Methods
        vm.gotoGames = gotoGames;
        vm.deleteConfirm = deleteConfirm;
        vm.updateGameName = updateGame;


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
                            40,30,20,10
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
        function updateGame(newName) {

            if (newName === '') return $q.reject();
            var def = $q.defer();

            var id = vm.game._id;

            api.games.update({id:id}, {name: newName},
                function() {
                    vm.game.name = newName;
                    vm.gameCopy.name = newName;
                    def.resolve();
                },
                function(error) {
                    alert(error.data.errmsg);
                    console.log(error);
                    vm.gameCopy.name = vm.game.name;
                    def.resolve();
                }
            );

            return def.promise;
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

                $mdDialog.show(confirm).then(function ()
                {

                    api.games.delete({id: vm.game._id}, 
                        function() {

                            vm.gotoGames();

                        }, function(error) {
                            alert(error.data.errmsg);
                            console.error(error);
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


    }
})();
