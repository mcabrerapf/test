(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController($scope, Themes, api, $compile)
    {
        var vm = this;
        vm.mode = 'edit';
        vm.minDate = new Date();
        vm.themes = Themes;

        vm.timelineEventTypes = ['Step', 'Goal', 'Message', 'Post', 'Quiz', 'Game'];

        // Data
        api.users.find(function(Users) {

            vm.Users = Users;

            var id = Users[0]._id;

            api.users.findOne({id:id},
                function(user) {
                    user.created = new Date(user.created);
                    user.modified = new Date(user.modified);
                    // user.theme = "580f46a7eb7006f1da6ecaee";
                    vm.user = user;
                },
                function(error) {
                    console.error(error);
            });

        });

        // Methods

        //////////
    }
})();
