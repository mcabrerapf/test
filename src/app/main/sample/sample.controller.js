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
        api.users.find({role:'editor'}, function(Users) {

            vm.Users = Users;

            var id = Users[0]._id;

            api.users.findOne({id:id},
                function(user) {
                    user.created = new Date(user.created);
                    user.modified = new Date(user.modified);
                    user.thumbnail = 'images/img4.jpg';
                    user.photo = 'img2.jpg'
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
