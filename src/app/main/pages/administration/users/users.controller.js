(function ()
{
    'use strict';

    angular
        .module('app.pages.administration.users')
        .controller('UsersController', UsersController);

    /** @ngInject */
    function UsersController(users, api, $mdDialog, $timeout, $filter)
    {
        var vm = this;

        vm.users = users;
        vm.filteredItems = users;
        
        console.log(users);

        // Methods
        vm.createNew = createNew;


        init();

        function init() {
            var searchBox = angular.element('body').find('#search');

            if ( searchBox.length > 0 )
            {
                searchBox.on('keyup', function (event)
                {
                    $timeout(function() {
                        if (event.target.value === '') {
                            vm.filteredItems = vm.users;
                        } else {
                            vm.filteredItems = $filter('filter')(vm.users, {"name": event.target.value});
                        }
                    });
                });
            }
        }

        //////////
        function createNew(event) {

            $mdDialog.show({
                controller:         'NewGameDialogController',
                controllerAs:       'vm',
                templateUrl:        'app/main/pages/users/new-user/newuser-dialog.html',
                parent:             angular.element(document.body),
                targetEvent:        event,
                clickOusideToClose: true
            });
        }
    }
})();
