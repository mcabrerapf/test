(function ()
{
    'use strict';

    angular
        .module('app.filters')
        .filter('timelineIcon', filterTimelineIcon);

    /** @ngInject */
    function filterTimelineIcon()
    {
        return function (eventType) {

            if (typeof eventType === 'object') eventType = eventType.type;
            if (eventType === undefined) return '';

            switch(eventType.toLowerCase()) {
                case 'step':
                    return 'icon-apple-safari';
                case 'goal':
                    return'icon-alarm-check';
                case 'message':
                    return 'icon-email';
                case 'post':
                    return 'icon-message-text';
            }

        };
    }

})();