(function ()
{
    'use strict';

    angular
        .module('app.core')
        .run(runBlock);

    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig, editableThemes)
    {
        /**
         * Generate extra classes based on registered themes so we
         * can use same colors with non-angular-material elements
         */
        fuseGenerator.generate();

        /**
         * Disable md-ink-ripple effects on mobile
         * if 'disableMdInkRippleOnMobile' config enabled
         */
        if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
        {
            var bodyEl = angular.element('body');
            bodyEl.attr('md-no-ink', true);
        }

        /**
         * Put isMobile() to the html as a class
         */
        if ( msUtils.isMobile() )
        {
            angular.element('html').addClass('is-mobile');
        }

        /**
         * Put browser information to the html as a class
         */
        var browserInfo = msUtils.detectBrowser();
        if ( browserInfo )
        {
            var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
            angular.element('html').addClass(htmlClass);
        }


        /**
         * Inline Edit Configuration
         * @type {string}
         */
        //editableThemes.default.submitTpl = '<md-button class="md-icon-button" type="submit" aria-label="save" translate-attr-aria-label="FORMS.SAVE"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
        //editableThemes.default.cancelTpl = '<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel" translate-attr-aria-label="FORMS.CANCEL"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

    }
})();