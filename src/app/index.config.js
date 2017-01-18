(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($translateProvider, $mdDateLocaleProvider)
    {
        // $mdDateLocaleProvider configuration
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD/MM/YYYY');
        };
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        $mdDateLocaleProvider.shortMonths = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        $mdDateLocaleProvider.days = ['domingo', 'lunes', 'marts', 'miercoles', 'jueves', 'viernes', 'sabado'];
        $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];


        moment.locale('es', {
            calendar: {
                lastDay : '[Ayer]',
                sameDay : '[Hoy]',
                nextDay : '[Mañana]',
                lastWeek : '[Ultimo] dddd',
                nextWeek : 'dddd',
                sameElse : 'L'
            }
        });

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('es');
        $translateProvider.useSanitizeValueStrategy('sanitize');
    }

})();
