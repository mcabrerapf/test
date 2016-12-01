(function ()
{
    'use strict';

    angular
        .module('app.core')
//        .filter('dateFormat', dateFormat)
        .filter('momentWithTime', momentWithTime)
        .filter('momentWithoutTime', momentWithoutTime);

    /** @ngInject */
    /*
    function dateFormat() {

        return function (date) {

            if (date == undefined || date == '') return $i18next('DateTime.unknown');
            
            var fecha;
            if (typeof date == 'string')
                fecha = new Date(date);
            else
                fecha = date;

            var text = "";
            var ahora = new Date();
            var delta = ahora - fecha;
            delta = parseInt(delta/1000);   // Pasa a segons sense decimals

            if (delta < 0)
                text = $filter('date')(fecha, $i18next('DateTime.titleFormat'));

        	else if (delta < 2)
                text = $i18next('DateTime.secondFormat');

            else if (delta < 60)
                text = $i18next('DateTime.secondsFormat', {tiempo: delta });

            else if (delta < 120)
                text = $i18next('DateTime.minuteFormat');

            else if (delta < 3600)
                // 60 * 60     Posava 2700, 45 * 60 no sé perquè
                text = $i18next('DateTime.minutesFormat', {tiempo: parseInt(delta/60) });

            else if (delta < 7200)
                // 60*60*2 (hasta la 2ª hora)
                text = $i18next('DateTime.hourFormat');

            else if (delta < 86400)
                text = $i18next('DateTime.hoursFormat', {tiempo: parseInt(delta/60/60) });

            else if (delta < 172800)
                // 48 * 60 * 60 (hasta 2ª hora)
                text = $i18next('DateTime.dayFormat');
                // {tiempo: // ell ha posat "yesterday" error, depèn de l'hora

            else if (delta < 2592000)
                // 60 * 60 * 24 * 30
                text = $i18next('DateTime.daysFormat', {tiempo: parseInt(delta/60/60/24) });

            else if (delta >= 2592000)
                text = $filter('date')(fecha, $i18next('DateTime.fullDateTime'));

            //return '<span title="' + $filter('date')(fecha, $i18next('DateTime.titleFormat')) + '">' + text + '</span>'
            return text;

        };
    }
    */

    function momentWithTime($filter) {

        return function (date) {
            if (date === undefined) { return ''; }
            if (typeof date === 'string') {
                date = new Date(date);
            }

            return $filter('date')(date, 'dd/MM/yyyy - HH:mm:ss');
        };
    }

    function momentWithoutTime($filter) {

        return function (date) {
            if (date === undefined) { return ''; }
            if (typeof date === 'string') {
                date = new Date(date);
            }

            return $filter('date')(date, 'dd/MM/yyyy');
        };
    }

})();