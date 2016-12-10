(function ()
{
    'use strict';

    angular
        .module('app.pages.administration')
        .controller('AdministrationController', AdministrationController);

    /** @ngInject */
    function AdministrationController(api, $mdDialog, $timeout, $filter)
    {
        var vm = this;
        init();

        function init() {

        }
    }
})();
