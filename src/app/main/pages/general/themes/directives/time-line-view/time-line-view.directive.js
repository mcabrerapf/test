(function ()
{
    'use strict';

    angular
        .module('app.pages.general.themes')
        .controller('timeLineViewController', timeLineViewController)
        .directive('timeLineView', timeLineViewDirective);

    /** @ngInject */
    function timeLineViewController($scope, $mdDialog, api)
    {
        var vm = this;
        vm.theme = $scope.theme;

        vm.timelineOptions = {
            scrollEl: '#timeline'
        };

        // Methods
        vm.createNew = createNew;
        vm.loadNextPage = loadNextPage;
        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
        }


        function loadNextPage() {

            return true;
        }

        /**
         * Create new (event)
         */
        function createNew() {

            vm.theme.timeline.push({
                "card": {
                    "template": "app/core/directives/ms-card/templates/template-3/template-3.html",
                    "title":"Poison",
                    "subtitle":"Alice Cooper",
                    "cta":"LISTEN NOW",
                    "media": {
                        "image":{
                            "src":"assets/images/etc/alice-cooper-poison.jpg",
                            "alt":"Alice Cooper - Poison"
                        }
                    }
                },
                "icon": "icon-music-note",
                "time": "July 22, 2015, 12:33AM",
                "event": "Duke shared a song with public"
            });

            vm.theme.timeline.push({
                card: {
                    template: 'app/core/directives/ms-card/templates/template-3/template-3.html',
                    title: 'titulo',
                    subtitle: 'Subtítulo',
                    cta: 'Este nose',
                    media: {
                        image: {
                            src: 'assets/images/etc/alice-cooper-poison.jpg',
                            alt: 'texto alternativo'
                        }
                    }
                },
                text: "hola que tla",
                icon: 'icon-person',
                time: 'Segunda semana',
                event: 'Inicio de etapa'
            });
        }
        //////////


    }
    
    /** @ngInject */
    function timeLineViewDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                theme: '=theme'
            },
            controller: 'timeLineViewController',
            controllerAs: 'vm',
            templateUrl: 'app/main/pages/general/themes/directives/time-line-view/time-line-view.html'
        };
    }
})();