(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.costumers')
        .controller('CostumersController', CostumersController);

    /** @ngInject */
    function CostumersController(costumers, api, $mdDialog, $timeout, $filter)
    {
        var vm = this;
        //
        // vm.costumers = costumers;
        // vm.filteredItems = costumers;
        //
        // console.log(costumers);

        // Methods
        vm.createNew = createNew;
        //
        //
        // init();
        //
        // function init() {
        //     var searchBox = angular.element('body').find('#search');
        //
        //     if ( searchBox.length > 0 )
        //     {
        //         searchBox.on('keyup', function (event)
        //         {
        //             $timeout(function() {
        //                 if (event.target.value === '') {
        //                     vm.filteredItems = vm.costumers;
        //                 } else {
        //                     vm.filteredItems = $filter('filter')(vm.costumers, {"name": event.target.value});
        //                 }
        //             });
        //         });
        //     }
        // }

        //////////
        function createNew(event) {

            console.log($mdDialog);

            $mdDialog.show({
                controller: function() {
                    console.log('dialog controller');
                },
                controllerAs: 'vm',
                templateUrl:  '<md-dialog aria-label="List dialog">' +
                '  <md-dialog-content>'+
                '    <md-list>'+
                '      <md-list-item ng-repeat="item in items">'+
                '       <p>Number {{item}}</p>' +
                '      '+
                '    </md-list-item></md-list>'+
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close Dialog' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOusideToClose: true
            })

            // $mdDialog.show({
            //     controller:         'NewCostumerDialogController',
            //     controllerAs:       'vm',
            //     templateUrl:        'app/main/pages/costumers/new-costumer/newcostumer-dialog.html',
            //     parent:             angular.element(document.body),
            //     targetEvent:        event,
            //     clickOusideToClose: true
            // });
        }
    }
})();
